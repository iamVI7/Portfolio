import { motion } from 'framer-motion'
import { journey } from '../../../data/story'
import { TimelineItem } from './TimelineItem'

export function TimelinePanel() {
  const reversed = [...journey].reverse()

  return (
    <div>
      <ol className="flex flex-col" aria-label="Career timeline">
        {reversed.map((item, i) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={i}
            isLast={i === reversed.length - 1}
          />
        ))}
      </ol>
    </div>
  )
}