import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel'

const slides = ['First slide', 'Second slide', 'Third slide']

const meta = {
  title: 'Components/UI/Carousel',
  component: Carousel,
  render: () => (
    <Carousel style={{ width: '20rem' }}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>{slide}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
