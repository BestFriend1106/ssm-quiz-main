import { FormEvent, forwardRef } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge'
import InputErrorMessage from './input-error-message'
import LoadingSpinner from '../icon/loading-spinner'

interface FileDropdownInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  errorMessage?: string
  inputClassName?: string
  isLoading?: boolean
  onUpload?(files: FileList): Promise<void>
}

const FileDropdownInput = forwardRef<HTMLInputElement, FileDropdownInputProps>(
  ({ className, onUpload, inputClassName, errorMessage, label, isLoading = false, ...props }, ref) => {
    const onUploadFile = async (event: FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement
      const files = target.files
      if (!files) return
      await onUpload?.(files)
    }

    return (
      <div className={className}>
        <label
          className={twMerge(
            'flex flex-col items-center justify-center p-2 w-full',
            'rounded-lg cursor-pointer',
            'border-2 border-gray-300 border-dashed bg-gray-50 hover:bg-gray-100',
            inputClassName,
            errorMessage && 'border-red-300'
          )}
        >
          <div className="flex items-center justify-center h-10">
            {isLoading ? (
              <LoadingSpinner size={6} className="fill-blue-300" />
            ) : (
              <>
                <CloudArrowUpIcon aria-hidden="true" className="w-10 h-10 text-gray-400" />
                <p className="ml-2 text-sm text-gray-500">
                  <span className="font-semibold">Clicca per caricare</span> il file
                </p>
              </>
            )}
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={onUploadFile} {...props} />
        </label>
        {errorMessage && <InputErrorMessage errorMessage={errorMessage} />}
      </div>
    )
  }
)

export default FileDropdownInput
