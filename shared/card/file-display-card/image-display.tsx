import { FileDisplayProps } from 'domain/question'
import { useBoolean } from 'lib/hooks/useBoolean'
import React from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import BaseModal from 'shared/overlay/base-modal'

const ImageDisplay = ({ file }: FileDisplayProps) => {
  const { state: isImageModalOpen, setTrue: openImageModal, setFalse: closeImageModal } = useBoolean(false)
  return (
    <>
      <BaseModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        className="px-2 pt-0 pb-4 max-w-none w-fit h-fit"
        hasTransparentBackground
      >
        <div className="top-0 flex flex-col items-center justify-center max-h-screen max-w-screen">
          <TransformWrapper limitToBounds centerZoomedOut centerOnInit minScale={1}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <React.Fragment>
                <div className="flex gap-2 py-1 tools">
                  <button
                    className="flex items-center justify-center h-auto rounded-full min-w-[1.5rem] bg-slate-100"
                    onClick={() => zoomIn()}
                  >
                    +
                  </button>
                  <button
                    className="flex items-center justify-center h-auto rounded-full min-w-[1.5rem] bg-slate-100"
                    onClick={() => zoomOut()}
                  >
                    -
                  </button>
                  <button
                    className="flex items-center justify-center h-auto rounded-full min-w-[1.5rem] px-3 bg-slate-100"
                    onClick={() => resetTransform()}
                  >
                    reset
                  </button>
                </div>
                <TransformComponent>
                  <div>
                    <img src={file.url} className="rounded-lg" />
                  </div>
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
      </BaseModal>
      <div className="relative h-auto cursor-pointer w-60" onClick={openImageModal}>
        <img src={file.url} className="relative object-fill rounded-lg" />
      </div>
    </>
  )
}

export default ImageDisplay
