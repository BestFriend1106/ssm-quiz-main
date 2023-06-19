import { FileDisplayProps } from 'domain/question'
import React, { useMemo } from 'react'

const VideoDisplay = ({ file }: FileDisplayProps) => {
  const renderVideo = useMemo(
    () => (
      <video controls className="w-1/2 rounded-xl">
        <source src={file.url} type={'video/mp4'} />
        Your browser does not support the video tag.
      </video>
    ),
    [file]
  )
  return renderVideo
}
export default VideoDisplay
