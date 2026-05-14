import { useCallback, useRef } from 'react'
import { SoundType } from '../types'

type PlayFn = (ctx: AudioContext, volume: number) => void

const sounds: Record<SoundType, PlayFn> = {
  bell: (ctx, vol) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 2)
  },

  chime: (ctx, vol) => {
    const freqs = [523, 659, 784, 1047]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.18
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(vol, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
      osc.start(t)
      osc.stop(t + 1.2)
    })
  },

  digital: (ctx, vol) => {
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.value = 1047
      const t = ctx.currentTime + i * 0.22
      gain.gain.setValueAtTime(vol * 0.4, t)
      gain.gain.setValueAtTime(0, t + 0.15)
      osc.start(t)
      osc.stop(t + 0.15)
    }
  },

  soft: (ctx, vol) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.value = 528
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.3)
    gain.gain.linearRampToValueAtTime(vol * 0.6, ctx.currentTime + 0.8)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 2.5)
  },
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = () => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }

  const play = useCallback((type: SoundType, volume: number) => {
    try {
      const ctx = getCtx()
      if (ctx.state === 'suspended') ctx.resume()
      sounds[type](ctx, volume)
    } catch {
      // AudioContext not available (e.g. during SSR or blocked)
    }
  }, [])

  return { play }
}
