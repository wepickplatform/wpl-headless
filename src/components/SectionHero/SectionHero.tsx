import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Image, { StaticImageData } from 'next/image'
import { FC, ReactNode } from 'react'
import MyImage from '../MyImage'

export interface SectionHeroProps {
	className?: string
	rightImg: string | StaticImageData
	heading: ReactNode
	subHeading: string
	btnText: string
}

const SectionHero: FC<SectionHeroProps> = ({
	className = '',
	rightImg,
	heading,
	subHeading,
	btnText,
}) => {
	return (
		<div className={`nc-SectionHero relative ${className}`}>
			<div className="relative flex flex-col items-center space-y-14 text-center lg:flex-row lg:space-x-10 lg:space-y-0 lg:text-left rtl:space-x-reverse">
				<div className="w-screen max-w-full space-y-5 lg:space-y-7 xl:max-w-lg">
					<h2 className="text-3xl font-semibold !leading-tight text-neutral-900 md:text-4xl xl:text-5xl dark:text-neutral-100">
						{heading}
					</h2>
					<span className="block text-base text-neutral-600 xl:text-lg dark:text-neutral-400">
						{subHeading}
					</span>
					{!!btnText && <ButtonPrimary href="/">{btnText}</ButtonPrimary>}
				</div>
				<div className="flex-grow">
					<MyImage className="w-full" src={rightImg} alt="" />
				</div>
			</div>
		</div>
	)
}

export default SectionHero
