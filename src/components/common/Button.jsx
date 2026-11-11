export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
