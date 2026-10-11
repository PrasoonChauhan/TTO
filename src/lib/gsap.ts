import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** House easing. Every reveal and hover in the site uses one of these. */
export const EASE = {
  reveal: 'power4.out',
  move: 'power3.out',
  inOut: 'power3.inOut',
  spring: 'elastic.out(1, 0.35)',
} as const

export { gsap, ScrollTrigger, useGSAP }
