import type React from "react";

type Props = {
    text: string,
}

const StaticBadge:React.FC<Props> = ({text}) => {
  return (
    <div className="h-fit w-fit px-4 py-1 grid place-content-center bg-gray-600 rounded-2xl">
        <p className="  text-neutral-200 text-xs md:text-sm">{text}</p>
    </div>
  )
}

export default StaticBadge;