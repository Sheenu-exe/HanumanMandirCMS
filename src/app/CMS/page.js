import Layout from "@/components/Layout"
const CMS = () => {
    return(
      <Layout>
        <div className="h-[100vh] w-full flex flex-col">
            <div className="flex gap-2 h-fit mt-6 justify-around w-full">
            <article className="flex w-[30%] h-fit justify-between rounded-lg border border-gray-100 bg-white p-6">
  <div>
    <p className="text-sm text-gray-500">Members</p>

    <p className="text-2xl font-medium text-gray-900">64</p>
  </div>
</article>
<article className="flex w-[30%] h-fit justify-between rounded-lg border border-gray-100 bg-white p-6">
  <div>
    <p className="text-sm text-gray-500">Collected Donation</p>

    <p className="text-2xl font-medium text-gray-900">12000</p>
  </div>


</article>
<article className="flex h-fit w-[30%] justify-between rounded-lg border border-gray-100 bg-white p-6">
  <div>
    <p className="text-sm text-gray-500">Aarti Slots</p>

    <p className="text-2xl font-medium text-gray-900">5</p>
  </div>


</article>
</div>
<div className="w-full h-full flex justify-center items-center">
    <div className="w-[97.5%] rounded-lg border border-gray-100 h-[90%] flex flex-wrap justify-center items-center gap-x-7">
    <div class="w-[45%] h-[45%] flex flex-col rounded-lg bg-gray-200">
        <p className="text-xl m-3">आगामी आरती:</p>
        <div className="flex w-full">
        <div className="w-full mx-3 flex flex-col">
            <p className="text-lg">मंगलवार</p>
            <p>सुरेशजी पुखराजजी</p>
            </div>
        <div className="w-full mx-3 flex flex-col">
            <p className="text-lg">शनिवार</p>
            <p>भंवरलालजी पुखराजजी</p>
            </div>
        </div>
    </div>
  <div class="w-[45%] h-[45%]  rounded-lg bg-gray-200"></div>
  <div class="w-[45%] h-[45%] rounded-lg bg-gray-200"></div>
  <div class="w-[45%] h-[45%] rounded-lg bg-gray-200"></div>
    </div>
</div>
        </div>
        </Layout>
    )
}

export default CMS