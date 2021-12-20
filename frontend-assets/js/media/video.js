const $ = require('jquery')
const Hls = require('hls.js')
const mediaUtils = require('./media')

const MEDIA = []
const DATA = []
const HSL_TYPE = 'application/vnd.apple.mpegurl'

function stopVideo(id) {
  const video = MEDIA[id]
  DATA[id].active = false
  $(video).finish()

  if (video.paused) {
    DATA[id].playPromise = Promise.resolve()
    return
  }

  DATA[id].playPromise = DATA[id].playPromise.then(function () {
    return mediaUtils.fadeout(video, function () {
      return DATA[id].active === false
    })
  })
}

function playBackgroundVideo(id, attrs) {
  const video = MEDIA[id]
  DATA[id].active = true
  $(video).finish()

  if (!video.paused) {
    return
  }

  video.loop = attrs.loop
  video.muted = attrs.muted

  if (
    (!DATA[id].paused && attrs.autoplay) ||
    (DATA[id].playTriggered && !DATA[id].paused)
  ) {
    DATA[id].playPromise = DATA[id].playPromise.then(function () {
      return mediaUtils.fadein(video)
    })
  }
}

function removeBackgroundVideo($el, id) {
  const $container = $el.find('.video-container')
  $container.css('position', '')
  stopVideo(id)
}

function fixBackgroundVideo($el) {
  const $container = $el.find('.video-container')
  $container.css('position', 'fixed')
}

function prepareVideo(scrollStory, $el, id, srcs, attrs) {
  let video = scrollStory.MURAL_VIDEO[id]
  if (attrs.poster) {
    video.poster = attrs.poster
  }
  video.muted = attrs.muted
  video.preload = 'auto'
  video.setAttribute('webkit-playsinline', '')
  video.setAttribute('playsinline', '')
  MEDIA[id] = video
  DATA[id] = {}
  DATA[id].playPromise = Promise.resolve()
  let canPlayThrough

  const sources = srcs.filter((src) => src.src !== undefined)
  const hslSource = sources.filter((src) => src.type === HSL_TYPE)[0]
  const normalSources = sources.filter((src) => src.type !== HSL_TYPE)

  if (Hls && hslSource && Hls.isSupported()) {
    canPlayThrough = new Promise(function (resolve, reject) {
      const hls = new Hls()
      hls.loadSource(hslSource.src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        resolve()
      })
    })
  } else if (Hls && hslSource && video.canPlayType(HSL_TYPE)) {
    canPlayThrough = new Promise(function (resolve, reject) {
      video.src = hslSource.src
      video.addEventListener('loadedmetadata', function () {
        resolve()
      })
    })
  } else {
    canPlayThrough = mediaUtils.canPlayThroughPromise(video, normalSources)
  }

  $el.find('.video-container').append(video)

  $el.find('.play').click(function () {
    DATA[id].playPromise = mediaUtils.fadein(video)
    DATA[id].paused = false
    DATA[id].playTriggered = true
    $(this).hide()
    $el.find('.pause').show()
  })

  $el.find('.pause').click(function () {
    stopVideo(id)
    DATA[id].paused = true
    $(this).hide()
    $el.find('.play').show()
  })

  if (attrs.autoplay === true) {
    $el.find('.play').hide()
  } else {
    $el.find('.pause').hide()
  }

  if (attrs.autoAdvance) {
    video.addEventListener('ended', () => {
      const count = scrollStory.getItems().length
      const next = id + 1

      if (next < count) {
        scrollStory.index(next)
      }

      // Allow it to restart from the beginning.
      video.currentTime = 0
    })
  }

  video.load()
  return canPlayThrough
}

function setMuted(id, muted) {
  const video = MEDIA[id]
  if (video) {
    video.muted = muted
  }
}

module.exports = {
  playBackgroundVideo,
  prepareVideo,
  removeBackgroundVideo,
  fixBackgroundVideo,
  setMuted,
}
