import { ComponentProps, useState } from 'react'
import { TrashIcon, XMarkIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { QuestionFull, QuestionType } from 'domain/question'
import { QuestionRepository } from 'lib/repositories/question-repository'
import { useUserContext } from 'lib/userContext'
import { items } from 'lib/utils/constants'
import SubmitButton from 'shared/button/submit'
import AutocompleteInput from 'shared/input/autocomplete-input'
import CheckboxInput from 'shared/input/checkbox-input'
import FileDropdownInput from 'shared/input/file-dropdown-input'
import InputErrorMessage from 'shared/input/input-error-message'
import InputLabel from 'shared/input/input-label'
import MultilineTextInput from 'shared/input/multiline-text-input'
import SwitchInput from 'shared/input/switch-input'
import TextInput from 'shared/input/text-input'
import SectionTitle from 'shared/text/section-title'
import { FileService } from 'lib/services/file-service'
import { uuidv4 } from '@firebase/util'
import FileCard from '../../../shared/card/file-card'
import { insertTextIntoFileName } from 'lib/utils/file'
import isEqual from 'lodash/isEqual'

const MAXIMUM_NUMBER_OF_ALTERNATIVES = 5
const DEFAULT_ALTERNATIVE = { text: '', isCorrect: false }
const DEFAULT_IMAGE = { name: '', description: '', url: '', fullPath: '' }

type CreateOrEditQuestionPageProps = {
  question: QuestionFull | null
  onClose?(): void
}
const CreateOrEditQuestionPage = ({ question, onClose }: CreateOrEditQuestionPageProps) => {
  const isCreateNewQuestion = !question?.id
  const title = isCreateNewQuestion ? 'Nuova' : 'Dettagli della'
  const submitAction = isCreateNewQuestion ? 'Creare' : 'Salvare'
  const onSuccess = isCreateNewQuestion ? QuestionRepository.createQuestion : QuestionRepository.editQuestion
  return (
    <>
      <div className="flex items-center justify-between overflow-y-scroll">
        <SectionTitle>{title} domanda</SectionTitle>
        <XMarkIcon className="w-8 h-8 cursor-pointer" onClick={onClose} />
      </div>
      <CreateOrEditQuestionForm
        question={question}
        submitAction={submitAction}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </>
  )
}

export default CreateOrEditQuestionPage

type CreateOrEditQuestionFormProps = CreateOrEditQuestionPageProps & {
  submitAction: string
  onSuccess: typeof QuestionRepository.createQuestion | typeof QuestionRepository.editQuestion
}

const CreateOrEditQuestionForm = ({ onClose, question, onSuccess, submitAction }: CreateOrEditQuestionFormProps) => {
  let defaultValues = question ? { ...question } : {}
  defaultValues = {
    ...(question ?? {}),
    images: question?.images?.length ? [...question?.images, DEFAULT_IMAGE] : [DEFAULT_IMAGE],
    correctionImages: question?.correctionImages?.length
      ? [...question?.correctionImages, DEFAULT_IMAGE]
      : [DEFAULT_IMAGE],
  }

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFull>({ defaultValues })

  const { firebaseUser } = useUserContext()

  const {
    fields: alternativesFields,
    append: appendAlternative,
    remove: removeAlternative,
  } = useFieldArray({ name: 'alternatives', control })

  const alternatives = useWatch({ control, name: 'alternatives', defaultValue: question?.alternatives ?? [] })

  const onSelectAlternative = (index: number) => {
    setValue(`alternatives.${index}.isCorrect`, true)
    onAddCorrectAlternative(index)
  }

  const onAddCorrectAlternative = (selectedAlternative: number) => {
    clearErrors('alternatives')
    alternatives.forEach((_, index) => {
      if (index !== selectedAlternative) {
        setValue(`alternatives.${index}.isCorrect`, false)
      }
    })
  }

  const addNewAlternative = () => {
    if (alternatives.length >= MAXIMUM_NUMBER_OF_ALTERNATIVES) return

    appendAlternative(DEFAULT_ALTERNATIVE, { focusName: `alternatives.${alternatives.length}.text` })
  }

  const [imagesUploading, setImagesUploading] = useState<string[]>([])
  const startUploadingImage = (index: string) => {
    if (imagesUploading.includes(index)) return
    setImagesUploading((previousImagesUploading) => [...previousImagesUploading, index])
  }
  const finishedUploadingImage = (index: string) => {
    setImagesUploading((previousImagesUploading) =>
      previousImagesUploading.filter((imageUploadingIndex) => imageUploadingIndex !== index)
    )
  }

  const { fields: imagesFields, append: appendImage, remove: removeImage } = useFieldArray({ name: 'images', control })
  const images = useWatch({ control, name: 'images', defaultValue: question?.images ?? [DEFAULT_IMAGE] })

  const {
    fields: correctionImagesFields,
    append: appendCorrectionImage,
    remove: removeCorrectionImage,
  } = useFieldArray({ name: 'correctionImages', control })

  const correctionImages = useWatch({
    control,
    name: 'correctionImages',
    defaultValue: question?.correctionImages ?? [DEFAULT_IMAGE],
  })

  const onUploadFiles = async ({
    files,
    imageType,
    fieldId,
    index,
    onSuccess,
  }: {
    files: FileList
    imageType: 'images' | 'correctionImages'
    fieldId: string
    index: number
    onSuccess: () => void
  }) => {
    const file = files[0]
    startUploadingImage(fieldId)
    const fileNameWithModifier = insertTextIntoFileName(file.name, `_${uuidv4()}`)
    const fileInfo = await FileService.uploadFile(file, `questions/${fileNameWithModifier}`)
    setValue(`${imageType}.${index}`, {
      fullPath: fileInfo.fullPath,
      url: fileInfo.url,
      name: file.name,
      type: fileInfo.contentType,
      size: fileInfo.size,
    })
    finishedUploadingImage(fieldId)
    onSuccess?.()
  }

  const removeImageFile = (index: number) => {
    const imageFile = images?.[index]
    if (!imageFile) return

    FileService.deleteFile(imageFile.fullPath)
    removeImage(index)
  }

  const removeCorrectionImageFile = (index: number) => {
    const correctionImageFile = correctionImages?.[index]
    if (!correctionImageFile) return

    FileService.deleteFile(correctionImageFile.fullPath)
    removeCorrectionImage(index)
  }

  const onSubmit = async (data: QuestionFull) => {
    if (!firebaseUser?.uid) return

    const hasAtLeastOneCorrectAlternative = data.alternatives.some((alt) => alt.isCorrect)
    if (!hasAtLeastOneCorrectAlternative) {
      setError('alternatives', { type: 'custom', message: "Seleziona almeno un'alternativa corretta" })
      return
    }

    const questionData = { ...data }
    questionData.id = question?.id ?? uuidv4()
    if (!questionData.type) questionData.type = QuestionType.Closed
    questionData.images = questionData.images?.filter((image) => !isEqual(image, DEFAULT_IMAGE)) ?? []
    questionData.correctionImages =
      questionData.correctionImages?.filter((image) => !isEqual(image, DEFAULT_IMAGE)) ?? []

    questionData.alternatives.forEach((alternative) => {
      if (!alternative.id) alternative.id = uuidv4()
    })
    const createdOrUpdatedQuestion = await onSuccess(questionData, firebaseUser.uid)
    if (question || createdOrUpdatedQuestion) onClose?.()
  }

  return (
    <form
      className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] mx-2 md:mx-10 py-2 gap-y-4 overflow-y-hidden"
      onSubmit={handleSubmit(onSubmit)}
    >
      <SwitchInput label="Pubblicata" className="mt-4" />
      <AutocompleteInput
        options={items}
        control={control}
        className="col-start-1 md:col-start-2"
        label="Item"
        aria-label="Item"
        placeholder="Item della domanda..."
        errorMessage={errors.item?.message}
        {...register('item', {
          required: "L'item è richiesto",
        })}
      />
      <SectionTitle className="col-start-1 font-normal ">Domanda</SectionTitle>
      <MultilineTextInput
        label="Descrizione"
        rows={4}
        className="col-start-1 md:col-span-2"
        aria-label="Domanda"
        placeholder="Descrizione della domanda..."
        errorMessage={errors.description?.message}
        {...register('description', {
          required: 'La domanda è richiesta',
        })}
      />
      {imagesFields.map((field, index) =>
        images?.[index]?.url ? (
          <FileCard
            className="col-start-1"
            key={field.id}
            file={images[index]}
            onDelete={() => removeImageFile(index)}
          />
        ) : (
          <FileDropdownInput
            key={field.id}
            isLoading={imagesUploading.includes(field.id)}
            className="col-start-1"
            onUpload={(files) =>
              onUploadFiles({
                files,
                imageType: 'images',
                fieldId: field.id,
                index,
                onSuccess: () => appendImage(DEFAULT_IMAGE),
              })
            }
          />
        )
      )}
      <InputLabel className="col-start-1">Alternative</InputLabel>
      {alternatives.length > 0 && (
        <span className="col-start-1 px-4 py-2 bg-green-300 rounded-lg text-slate-500 w-fit">È corretta?</span>
      )}
      {alternativesFields.map((field, index) => {
        const checkboxProps = register(`alternatives.${index}.isCorrect` as const, {
          onChange: () => onAddCorrectAlternative(index),
        })
        const inputProps = register(`alternatives.${index}.text` as const, { required: "È richiesta l'alternativa" })

        return (
          <QuestionAlternativeInput
            key={field.id}
            index={index}
            isSelected={alternatives[index]?.isCorrect}
            checkboxProps={checkboxProps}
            inputProps={inputProps}
            onSelect={() => onSelectAlternative(index)}
            onDelete={() => removeAlternative(index)}
            errorMessage={errors.alternatives?.[index]?.text?.message}
          />
        )
      })}
      {errors.alternatives?.message && (
        <InputErrorMessage className="col-start-1 mt-1" errorMessage={errors.alternatives?.message} />
      )}
      {alternatives.length < MAXIMUM_NUMBER_OF_ALTERNATIVES && (
        <button
          type="button"
          className="col-start-1 py-3 bg-white border-2 border-gray-300 border-dashed rounded-lg font-italic hover:bg-gray-100 text-slate-500"
          onClick={addNewAlternative}
          onFocus={addNewAlternative}
        >
          Aggiungi alternativa
        </button>
      )}
      <SectionTitle className="col-start-1 font-normal ">Correzione</SectionTitle>
      <MultilineTextInput
        label="Descrizione"
        rows={4}
        className="col-start-1 md:col-span-2"
        aria-label="Correzione"
        placeholder="Descrizione della correzione..."
        errorMessage={errors.description?.message}
        {...register('correctionText', {
          required: 'La correzione è richiesta',
        })}
      />
      {correctionImagesFields.map((field, index) =>
        correctionImages?.[index]?.url ? (
          <FileCard
            className="col-start-1"
            key={field.id}
            file={correctionImages[index]}
            onDelete={() => removeCorrectionImageFile(index)}
          />
        ) : (
          <FileDropdownInput
            key={field.id}
            isLoading={imagesUploading.includes(field.id)}
            className="col-start-1"
            onUpload={(files) =>
              onUploadFiles({
                files,
                imageType: 'correctionImages',
                fieldId: field.id,
                index,
                onSuccess: () => appendCorrectionImage(DEFAULT_IMAGE),
              })
            }
          />
        )
      )}
      <SubmitButton isLoading={isSubmitting} className="col-span-2 mt-4">
        {submitAction}
      </SubmitButton>
    </form>
  )
}

const QuestionAlternativeInput = ({
  index,
  isSelected,
  errorMessage,
  onSelect,
  onDelete,
  checkboxProps = {},
  inputProps = {},
}: {
  index: number
  isSelected: boolean
  errorMessage?: string
  onSelect?(): void
  onDelete?(): void
  checkboxProps?: ComponentProps<typeof CheckboxInput>
  inputProps?: ComponentProps<typeof TextInput>
}) => {
  return (
    <div className="flex flex-col col-span-2 col-start-1 md:max-w-[50rem]">
      <div className="flex items-center justify-center w-full grow">
        <div
          className={classNames(
            'flex items-center justify-center h-full mr-2 text-white rounded-lg aspect-square cursor-pointer',
            isSelected ? 'bg-green-500' : 'bg-green-200'
          )}
          onClick={onSelect}
        >
          <CheckboxInput inputClassName="shadow-none focus:ring-0 active:ring-0 ring-0" {...checkboxProps} />
        </div>
        <div className="flex items-center justify-center h-full mr-2 uppercase bg-white rounded-lg text-slate-500 aspect-square">
          {String.fromCharCode(97 + index)}.
        </div>
        <TextInput className="w-full" inputClassName="border" {...inputProps} />
        <div
          className="flex items-center justify-center h-full px-2 ml-2 text-white bg-red-500 rounded-lg cursor-pointer aspect-square"
          onClick={onDelete}
        >
          <TrashIcon className="w-4 h-4" />
        </div>
      </div>
      {errorMessage && <InputErrorMessage className="mt-1 ml-[7.3rem]" errorMessage={errorMessage} />}
    </div>
  )
}
