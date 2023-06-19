import { twMerge } from 'tailwind-merge'
import {
  MusicalNoteIcon,
  DocumentIcon,
  DocumentTextIcon,
  FolderIcon,
  PhotoIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'

import { TrashIcon } from '@heroicons/react/24/solid'
import { QuestionFile } from 'domain/question'
import { IconComponent } from 'types'
import Body1 from 'shared/text/body1'
import Body2 from 'shared/text/body2'
import { useTextInEllipsis } from 'lib/hooks/useTextInEllipsis'
import Tooltip from 'shared/overlay/tooltip'

type FileCardProps = {
  file: Pick<QuestionFile, 'url' | 'name' | 'type' | 'size'>
  onDelete?(): void
  onClick?(): void
  className?: string
}

const contentTypeIconMap: Record<string, IconComponent> = {
  image: PhotoIcon,
  audio: MusicalNoteIcon,
  video: PlayIcon,
  'text/plain': DocumentTextIcon,
  'text/html': DocumentTextIcon,
  'application/gzip': FolderIcon,
  'application/zip': FolderIcon,
  default: DocumentIcon,
}

const FileCard = ({ className, file, onDelete, onClick }: FileCardProps) => {
  const { textRef: fileNameRef, hasEllipsis } = useTextInEllipsis<HTMLInputElement>()
  const contentType = file?.type ?? 'default'
  let ContentTypeIcon = contentTypeIconMap['default']
  Object.entries(contentTypeIconMap).forEach(([type, icon]) => {
    if (contentType.startsWith(type)) {
      ContentTypeIcon = icon
    }
  })

  if (!file.url) return null

  const getHumanReadableSize = (bytes: number = 0, useSiSystem: boolean = true) => {
    const metricBase = useSiSystem ? 1000 : 1024
    const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(metricBase))
    return (!bytes && '0 Bytes') || (bytes / Math.pow(metricBase, i)).toFixed(2) + ' ' + sufixes[i]
  }

  return (
    <div
      className={twMerge(
        'flex items-center bg-gray-50 p-4 pr-6 py-3 min-w-0 border-gray-200 border rounded-2xl h-fit',
        className,
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="w-fit">
        <ContentTypeIcon className="w-8 h-8 text-slate-400" />
      </div>
      <div className="w-full min-w-0 ml-2 truncate text-slate-600">
        <Tooltip content={file.name} show={hasEllipsis}>
          <Body1 ref={fileNameRef} className="truncate">
            {file.name}
          </Body1>
        </Tooltip>
        <Body2>{file.type}</Body2>
        <Body2>{getHumanReadableSize(file.size)}</Body2>
      </div>
      {onDelete && (
        <div>
          <TrashIcon className="w-5 h-5 ml-4 text-red-500 cursor-pointer" onClick={onDelete} />
        </div>
      )}
    </div>
  )
}

export default FileCard
