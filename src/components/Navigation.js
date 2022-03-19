export default function Navigation () {
  return (
    <>
      <div className="h-16 w-full" />
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 flex gap-4 p-2 items-center z-[3000]">
        <div className="flex-grow px-4">
          <div className="font-bold text-lg">授業予定の編集</div>
        </div>
        <div>
          <button className="bg-blue-500 text-white rounded p-2 px-4">確定する</button>
        </div>
      </div>
    </>
  )
}
