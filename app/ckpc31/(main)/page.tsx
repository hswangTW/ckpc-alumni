import Link from 'next/link'
import Image from 'next/image'

import AddItemModal from '../components/add-item-modal';

export default function Home() {

  return (
    <main className='flex'>
      <p>
        你滿心期待地參加了高中社團學弟舉辦的活動，卻發現事情不太對勁......你必須在活動現場解開種種謎題，找出真相！<br />
        <br />
        在「劇情」頁面中，你可以閱讀劇情，在「歷史碎片」頁面中，你可以查看你已經獲得的歷史碎片、新增歷史碎片、或選擇提交歷史碎片。
      </p>
    </main>
  )
}
