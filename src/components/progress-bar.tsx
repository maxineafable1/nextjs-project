type ProgressBarProps = {
  barWidth: string | undefined
}

export default function ProgressBar({ barWidth }: ProgressBarProps) {
  return (
    <div role="progressbar" className="bg-neutral-400 my-8">
      <div className={`bg-green-500 h-0.5 ${barWidth} transition-all duration-500`}></div>
    </div>
  )
}
