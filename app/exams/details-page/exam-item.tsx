import Body2 from 'shared/text/body2'

const ITEM_SEPARATOR = ' - '
const ExamItem = ({ examItem, className }: { examItem: string; className?: string }) => {
  const [itemNumber, ...itemNameParts] = examItem.split(ITEM_SEPARATOR)
  const itemName = itemNameParts.join(ITEM_SEPARATOR)

  return (
    <Body2 className={className}>
      <span className="font-bold text-blue-500 text">Item {itemNumber}</span> {ITEM_SEPARATOR}
      {itemName}
    </Body2>
  )
}

export default ExamItem
