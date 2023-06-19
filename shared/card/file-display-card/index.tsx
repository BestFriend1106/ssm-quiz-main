import { FileDisplayProps } from 'domain/question'
import React, { FunctionComponent } from 'react'
import ImageDisplay from './image-display'
import FileCard from 'shared/card/file-card'
import VideoDisplay from './video-display'

const FileDisplay = ({ file }: FileDisplayProps) => {
  const openFileInAnotherWindow = () => window.open(file.url, '_blank')
  const contentTypeRenderingMap: Record<string, FunctionComponent<Pick<FileDisplayProps, 'file'>>> = {
    image: () => <ImageDisplay file={file} />,
    video: () => <VideoDisplay file={file} />,
    default: () => <FileCard file={file} onClick={openFileInAnotherWindow} />,
  }

  const contentType = file?.type ?? 'default'
  let FileDisplayComponent = contentTypeRenderingMap['default']
  Object.entries(contentTypeRenderingMap).forEach(([type, renderingComponent]) => {
    if (contentType.startsWith(type)) {
      FileDisplayComponent = renderingComponent
    }
  })
  return <FileDisplayComponent file={file} />
}

export default FileDisplay
