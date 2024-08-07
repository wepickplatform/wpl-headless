import { FragmentType } from '@/__generated__'
import { NC_FOOTER_MENU_QUERY_FRAGMENT } from '@/fragments/menu'
import WidgetAddSubscriberForm from '../WidgetAddSubscriberForm/WidgetAddSubscriberForm'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import MyImage from '../MyImage'
import { flatListToHierarchical } from '@faustwp/core'
import { NcFooterMenuFieldsFragmentFragment } from '@/__generated__/graphql'
import Link from 'next/link'

interface Props {
	menuItems: FragmentType<typeof NC_FOOTER_MENU_QUERY_FRAGMENT>[] | null
}

export type FooterNavItemType = NcFooterMenuFieldsFragmentFragment & {
	children?: FooterNavItemType[]
}

export default function Footer({ menuItems }: Props) {
	const menus = flatListToHierarchical(menuItems || [], {
		idKey: 'id',
		parentKey: 'parentId',
		childrenKey: 'children',
	}) as FooterNavItemType[]

	const renderMenuItem = (item: FooterNavItemType, index: number) => {
		return (
			<div key={index + item.id}>
				<h3 className="text-sm font-semibold leading-6 text-neutral-900 dark:text-neutral-200">
					<Link href={item.uri ?? '/'}>{item.label}</Link>
				</h3>
				<ul role="list" className="mt-6 space-y-4">
					{item.children?.map((j, id) => (
						<li key={j.id + id}>
							<Link
								href={j.uri ?? ''}
								className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
							>
								{j.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		)
	}

	return (
		<footer
			className="border-t border-neutral-900/10 bg-white dark:border-transparent dark:bg-neutral-900"
			aria-labelledby="footer-heading"
			style={{background:'#efefef'}}
		>
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 pb-8 lg:pt-28" style={{paddingTop:'2rem'}}>
				<div className="sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24 dark:border-neutral-700">
					<div style={{ flex: 1 }}>
						<div style={{lineHeight: 2.0, display: 'flex', gap: '10px', marginBottom: '10px'}}>
							<span className="mt-8 text-[13px] leading-5 text-black md:order-1 md:mt-0">위픽레터 소개</span>
							<span className="mt-8 text-[13px] leading-5 text-black md:order-1 md:mt-0">에디터 신청</span>
							<span className="mt-8 text-[13px] leading-5 text-black md:order-1 md:mt-0">제휴문의</span>
							<span className="mt-8 text-[13px] leading-5 text-black md:order-1 md:mt-0">구독하기</span>
							<span className="mt-8 text-[13px] leading-5 text-black md:order-1 md:mt-0">불편접수</span>
							<span className="mt-8 text-[13px] leading-5 text-black md:order-1 md:mt-0">공지사항</span>
						</div>
						<p className="mt-8 text-[13px] leading-5 text-gray-500 md:order-1 md:mt-0" style={{lineHeight: 1.6}}>위픽레터 | 대표 김태환 | 02-6013-2873 | 성수 HQ: 서울시 성동구 연무장 5길 18<br />
							유럽 BR. Narva mnt 5, 10117 Tallinn, Estonia | letter@wepick.kr<br />
							인터넷신문등록번호 : 서울 아 52632 | 발행·편집인 : 이재훈 | 등록(발행)일 : 2019.10.01<br />
							청소년보호책임자 : 이재훈</p><br />
						<p className="mt-8 text-[13px] leading-5 text-gray-500 md:order-1 md:mt-0">{NC_SITE_SETTINGS.site_footer?.all_rights_reserved_text}</p>
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-3 md:order-2" style={{ flex: 1 }}>
						{NC_SITE_SETTINGS.site_socials?.map(item => (
							<a
								key={item?.name}
								href={item?.url}
								className="relative block"
								target="_blank"
								rel="noreferrer"
							>
								<span className="absolute -inset-0.5 hidden rounded-lg bg-neutral-400 dark:block"></span>
								<span className="sr-only">{item?.name}</span>
								<MyImage
									width={22}
									height={22}
									className="max-h-[22px] opacity-60 hover:opacity-100"
									src={item?.icon || ''}
									alt={item?.name || ''}
								/>
							</a>
						))}
						<p className="mt-8 text-[13px] leading-5 text-gray-500 md:order-1 md:mt-0" style={{lineHeight: 1.6}}>
						<b>마케터 라이프 사이클 플랫폼 위픽을 만드는 사람들</b> <br />고병우·권상현·김단아·김동규·김소연·김태환·김현철·김효경·김희지·박준후·서정완·손인범·신영규·엄두호·오지윤·이광희·이상용·이재광·이정수·이정하·임동규·장진광·정진서·조희연·최신일·최윤성·한광복·허성덕·홍문화·김정우·이홍래·박장순·박희은
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}
