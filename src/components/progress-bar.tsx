type ProgressBarProps = {
  barWidth: string | undefined
}

export default function ProgressBar({ barWidth }: ProgressBarProps) {
  return (
    <div role="progressbar" className="bg-neutral-400 mt-6 mb-4">
      <div className={`bg-green-500 h-0.5 ${barWidth} transition-all duration-500`}></div>
    </div>
  )
}
