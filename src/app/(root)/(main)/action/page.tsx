import Wrapper from "@/components/Wrapper";
import { sideCategory } from "@/constants/constants";


const ActionPage = () => {
  return (
    <section>
      <Wrapper>
        <div className='flex py-10'>
          <div className='flex flex-col w-14 md:w-36 h-screen p-10 bg-gray-100'>
            <div className='space-y-2'>
              {sideCategory?.map((item) => (
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