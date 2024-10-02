import Wrapper from "@/components/Wrapper";


const Category = [
  { label: "胸", icon: "/icons/dumbbell.svg", },
  { label: "背", icon: "/icons/dumbbell.svg", },
  { label: "肩", icon: "/icons/shoulder.svg", },
  { label: "腿", icon: "/icons/leg.svg", },
  { label: "二頭", icon: "/icons/dumbbell.svg", },
  { label: "三頭", icon: "/icons/dumbbell.svg", },
]

const ActionPage = () => {
  return (
    <section>
      <Wrapper>
        <div className='flex py-10'>
          <div className='flex flex-col w-14 md:w-36 h-screen p-10 bg-gray-100'>
            <div className='space-y-2'>
              {Category?.map((item) => (
                <div key={item.label}>
                  <p> {item.label} </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default ActionPage