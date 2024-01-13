import { sql } from "@vercel/postgres"
import { unstable_noStore as noStore } from 'next/cache';

type Story = {
  id: number,
  title: string,
  content: string,
};

function replaceLineBreaks(content: string): string {
  return content.replace(/\n/g, '<br />');
}

const stories: Story[] = [
  {
    id: 0,
    title: '序幕',
    content: '收到來自久遠時曾參加的高中社團邀請，我來到這參加了學弟們舉辦的派對。\n\n\
              距離上次回社團看看是什麼時候的事了？十年？十五年？算了，已經記不太清了。\n\n\
              恍惚間看到幾個熟悉的背影，走近一看，果然是他們！大家變得再多，我都還是認得出來，這就是無數次睡在社辦的交情吧！\n\n\
              一談起社辦大家就突然來勁了，紛紛懷念起當年在紅樓地下室的黑色社辦...\n\n\
              咦？不是這樣嗎？我不可能記錯啊？\n\n\
              大家紛紛皺起眉頭互相講述「真正的社辦」應該長怎樣、在哪裡。\n\n\
              但是好奇怪...為什麼每個人說的都有天壤之別...\n\n\
              霎時間，大家吵作了一團。就在這時候，帷幕拉起，主持人讓我們入座，在開場前表示對建物創始者的敬意。\n\n\
              等等...那張照片...那個人...是誰？！',
  },
  {
    id: 1,
    title: '第一幕',
    content: '哥本哈根詮釋是一種主流的量子力學觀點，某些科學家認為，可以用波函數來體現某些事實的可能性。\n\n\
              箱子裡貓貓的生與死？熱食部的雞排會被吃掉或是成為中午的雞排飯？那個女孩會回應我的企求或者投入別人的懷抱？\n\n\
              在塵埃落定前，一切都可以用波函數來估算它的概率，直到被觀察從而塌縮成客觀的事實前。\n\n\
              那如果...過去的種種還只是一條條尚未崩解的波函數，我是否有機會重新挑選，重組成更美好的事實呢？'
  },
  {
    id: 2,
    title: '第二幕',
    content: '蝴蝶效應告訴我們，一隻蝴蝶在巴西輕拍翅膀，可以導致一個月後德克薩斯州的一場龍捲風。\n\n\
    歷史碎片是過去種種的可能性，每一塊都可能是建物經歷過的歷史。\n\n\
    在我們為了拼湊出更好的未來時，每一塊的揀選和捨棄都會影響著建物過往的積累。\n\n\
    每一次的淘選，也許都由命運標記好了價格。\n\n\
    只是我們還沒有意識到將要...或已經付出了什麼代價。'
  },
  {
    id: 3,
    title: '第三幕',
    content: '經歷一連串的探索，對於現在的情況大家也大致有了些頭緒。\n\n\
    不是什麼曼德拉效應，更不是平行宇宙，被擾亂的東西不僅僅是我們的認知，更是建物曾經歷的歷史！\n\n\
    我們手上的歷史碎片就是建物過去的種種可能性。如果不找個方法安裝回去，建物就不再是建物了。\n\n\
    但就在大家討論著要怎麼把歷史碎片「安裝」回去的時候，我發現了一個問題。\n\n\
    有的碎片說社辦是藍的，有的說是紅的。\n\n\
    有的人記得建物一直以來都以物理能力競賽作為考幹標準，但有個自稱社長的傢伙高二物理被當。\n\n\
    到底...哪一塊碎片是真的？！'
  },
];

function StoryCard({ id, title, content }: Story) {
  return (
    <div className='flex flex-col bg-ckpc-buff-light rounded-lg p-4'>
      <p className='text-ckpc-brown text-xl pb-4 text-center font-bold'>{title}</p>
      <p className='text-ckpc-brown text-sm' dangerouslySetInnerHTML={{ __html: replaceLineBreaks(content) }} />
    </div>
  );
}

export default async function Home() {
  noStore();

  const data = await sql`
    SELECT id, hidden FROM ckpc31_stories;
  ` as { rows: { id: number, hidden: boolean }[] };

  const displayedStories = stories.filter((story) => {
    const row = data.rows.find((row) => row.id === story.id);
    return row && !row.hidden;
  });

  return (
    <div>
      <p className='text-ckpc-brown text-xs pb-2'>隨著遊戲進行，此處有可能會出現新的劇情...</p>
      <div className='flex flex-col gap-2'>
        {displayedStories.map((story) => (
          <StoryCard key={story.id} {...story} />
        ))}
      </div>
    </div>
  )
}