import fs from 'fs';
import path from 'path';
import Image from 'next/image';

type Params = {
  id : string,
}

const itemIds = (() => {
  const itemsDirectory = path.join(process.cwd(), 'public/images/items');
  const filenames = fs.readdirSync(itemsDirectory);
  return filenames.map((filename) => (filename.replace(/.png$/, '')));
})();

export async function generateStaticParams() {
  return itemIds.map((itemId) => ( {id: itemId} ));
}

export default function Page({ params }: { params: Params }) {
  const { id } = params;
  if (itemIds.includes(id)) {
    return (
      <div>
        <p>Found item id: {id}.</p>
        <Image
          src={`/images/items/${id}.png`}
          width={500}
          height={500}
          alt={`Item: ${id}`}
        />
      </div>
    );  
  } else {
    return (
      <div>
        <p>Cannot find item id: {id}</p>
      </div>
    )
  }
}