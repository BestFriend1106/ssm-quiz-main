export const TopHeader = ({}) => {
  return (
    <div className="bg-[#DEDEDE] flex items-center gap-8">
      <img src="/exam-filling/dna-model.png" className="pl-10 max-w-[55%]" />
      <div
        className="w-48 bg-center bg-no-repeat bg-contain h-7"
        style={{
          backgroundImage: 'url(/exam-filling/ssm-quiz-logo.svg)',
        }}
      />
    </div>
  )
}
