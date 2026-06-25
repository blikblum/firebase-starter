export type MovieLinkProps = {
  to: string
  className?: string
  children?: React.ReactNode
}

export type MovieLinkRenderer = (props: MovieLinkProps) => React.ReactElement

export const defaultRenderMovieLink: MovieLinkRenderer = ({ to, ...props }) => {
  return <a href={to} {...props} />
}
