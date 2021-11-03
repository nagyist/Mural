import { Storyboard } from '../electron/exportFrontend'
declare global {
  interface Window {
    MEDIA_PATH: string
    electron: {
      storeImage: (arg: any) => Promise<any>
      storeVideo: (arg: any) => Promise<any>
      storeAudio: (arg: any) => Promise<any>
      openPreview: () => Promise<any>
      renderPreview: (state: Storyboard) => Promise<any>
      resetStory: () => Promise<any>
      exportAsZip: () => Promise<any>
      onOpenFile: (reduxState: any) => any
      saveAs: (reduxState: any) => Promise<any>
      onSaveAsMenuClick: any
      directories: {
        root: string
        previewDir: string
        media: string
        image: string
      }
    }
  }
}
