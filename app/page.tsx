"use client";

import AsideRight from "@/components/AsideRight";
import BottomSheet from "@/components/BottomSheet";
import useScroll from "@/hooks/useScroll";
import { useRef } from "react";

/*
  <div>
    {status === "authenticated" || status === "loading" ? (
      <button className='m-3 border bg-gray-100' onClick={() => alert(generateSqid())}>Like</button>
    ) : (
      <AuthModal buttonTrigger={<button className='m-3 border bg-gray-100'>Like</button>} />
    )}

    {JSON.stringify(session?.user)}

    {status == "authenticated" && <button onClick={() => signOut({ callbackUrl: "/" })}>Cerrar sesión</button>}
  </div>
*/

const Page = () => {
  return (
    <>
      <div className='w-full overflow-hidden'>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel provident, officiis facilis doloribus corporis maiores perspiciatis sequi vitae dicta, voluptatibus assumenda debitis impedit eaque in quis ad iure cum enim obcaecati porro sapiente tenetur! Magnam assumenda tempore cumque, eum autem dolorum molestias omnis esse expedita, doloremque, laboriosam soluta modi doloribus quis pariatur? Quis tempore eum explicabo odio incidunt, beatae veritatis nobis molestias deleniti cum accusantium quaerat nostrum cupiditate in ut. Minus, repellendus? Deserunt rerum, officia eum dolorem similique ad nemo illo quidem, neque, sint ea maxime est ratione hic. Facere odio commodi beatae alias quisquam necessitatibus quas maiores, quia, porro, quibusdam aspernatur ipsam architecto facilis! Hic cum quod facilis deserunt itaque, excepturi reprehenderit enim nesciunt repudiandae, aperiam, quaerat provident. Fugit libero magni obcaecati, repudiandae, qui officiis eum esse pariatur corrupti earum incidunt enim non inventore dicta ipsum impedit! Laudantium esse fuga harum officia? Dolores odit maxime soluta dolore ipsa odio beatae! Facilis nesciunt magnam adipisci corporis repellat nemo, recusandae quis culpa blanditiis doloremque. Reprehenderit dignissimos non, rerum obcaecati ratione consequatur distinctio cumque ex amet inventore dolorum, fugiat officiis earum tempora vitae quasi possimus at, corporis mollitia voluptatem. Illo, ad a. Repellendus enim excepturi quae illum quibusdam officia explicabo distinctio accusantium qui neque saepe consequatur, necessitatibus, sunt dignissimos earum maxime tempore culpa. Delectus doloremque mollitia earum, sit aspernatur impedit temporibus nemo a placeat fuga iusto, voluptatem dicta omnis ex. Recusandae omnis nihil fugiat magnam aliquam architecto? Assumenda culpa labore similique tempora vel sunt eveniet quis! Quibusdam minima, quo minus cupiditate corrupti exercitationem, dolores quasi animi officiis eos vero molestias, incidunt perferendis? Cum cupiditate vero nulla magni nisi voluptatem hic totam officiis nam? Quaerat maiores possimus excepturi tenetur, quia amet corporis voluptatum accusamus nulla, unde voluptate, quod perspiciatis? Laboriosam iste cumque maxime similique rerum ea, minus molestiae molestias dicta deserunt sunt ipsum enim praesentium facere necessitatibus fugit magni libero aut iusto nihil provident corrupti nesciunt! Eaque pariatur quod esse. Atque cum eius qui perferendis maxime eveniet facilis similique facere distinctio sit mollitia labore ea tempora beatae dolores, sapiente delectus doloribus, tempore dicta, nihil ab temporibus veritatis corporis? Officia delectus porro deleniti blanditiis. Illum ducimus iusto, sequi eius consequatur officia at ipsa quas voluptates dolorem quibusdam voluptatem reiciendis aut maxime libero molestias inventore quos qui! Molestiae expedita quo distinctio magni, dignissimos ex. Distinctio at vero aut in sint vel sequi quo nemo, minus magnam a reiciendis officia molestias quibusdam molestiae. Molestiae nihil odit eligendi necessitatibus obcaecati molestias, dignissimos doloremque quod quos mollitia, sapiente laborum est sint accusamus quaerat omnis soluta alias temporibus, expedita vitae accusantium animi possimus aliquam! Eaque eveniet quas debitis aliquid earum possimus laboriosam asperiores corrupti mollitia dolor quae aspernatur deleniti exercitationem repudiandae quibusdam iusto voluptatum perferendis, architecto natus autem praesentium repellat numquam ipsum. Necessitatibus provident enim rerum aperiam eaque cum fugiat nobis, similique esse veniam eveniet cumque assumenda aliquam sed deserunt corporis inventore, voluptates ullam. Repudiandae illum mollitia eos laborum officia. Aut consequatur fugiat ipsa inventore voluptatibus magnam nobis non tempore doloribus adipisci. Voluptates ad accusantium officiis nesciunt! Id corrupti sed amet voluptates quod quas, quibusdam repellat! Et, cumque. Iste inventore dolores placeat expedita accusamus dolorem ducimus labore, fuga quae vitae. Non expedita reprehenderit illo animi laudantium quaerat incidunt aspernatur pariatur nesciunt, ab beatae officia praesentium possimus! Nulla, totam soluta, ipsam temporibus quia accusamus doloribus sequi odit impedit esse molestiae hic dolores, alias ipsum beatae! Excepturi culpa placeat natus explicabo harum dolorem. Sunt magnam qui, cumque, quia optio eos nesciunt quaerat, labore animi iure iste quasi pariatur. Soluta hic veritatis illo harum? Quia quibusdam totam tempore maiores saepe ad sequi debitis error ipsam blanditiis modi ut, earum repudiandae laborum, unde aliquam nostrum aperiam voluptas dolorum maxime repellat non fuga sunt? Voluptatem, quasi. Aliquam, rem maxime provident necessitatibus perferendis suscipit libero optio doloribus alias voluptate iusto temporibus aperiam quia maiores odit corrupti iure molestias asperiores exercitationem aut accusantium harum inventore. Vero ipsam quidem eum, quas, eos illo deserunt tempore corporis veritatis atque tenetur adipisci ut. Nobis vel unde et natus fugiat, accusamus labore ipsam assumenda pariatur a dignissimos consequuntur ut odit aspernatur dolorem quisquam hic commodi doloremque illum amet recusandae quos adipisci. Consequatur ad ex at rem quibusdam recusandae praesentium consectetur numquam dolor exercitationem iure officia minima, consequuntur ratione, excepturi quaerat soluta neque voluptatum expedita dolores quo explicabo! Cumque, explicabo adipisci ipsum, minima accusantium impedit praesentium aliquid magnam pariatur quia libero! Libero sunt nisi fugit adipisci deleniti, deserunt aliquam assumenda veritatis aliquid magnam laboriosam quo. Necessitatibus dolores iusto aliquam placeat, facere sunt modi. Perspiciatis, nemo fugit! Aliquid amet dolore, asperiores dolorum porro excepturi minima eaque perspiciatis numquam laudantium eligendi aspernatur, at est maiores ducimus non saepe fuga, sapiente deleniti atque repellat natus. Architecto rerum quas molestiae itaque, est tempora quos totam magnam ipsam facilis qui odio optio incidunt repellendus aspernatur aperiam iste reiciendis repudiandae quod ducimus vitae iusto non! In atque rem error possimus temporibus, quisquam, eius laudantium ipsum placeat id repellendus corrupti exercitationem officiis distinctio voluptate vero laboriosam harum ipsam, magnam facilis deserunt. Maxime eaque quasi soluta perferendis nostrum reprehenderit! Repellat similique labore cum id fugit et illum nihil. Aut sapiente est ipsam officia quae saepe ullam, quaerat deleniti amet rem doloribus libero. Commodi, consequuntur alias? Provident quam nostrum ea, blanditiis suscipit eius possimus natus facere? Fugit reiciendis et excepturi quaerat? Delectus, illo! Odio est id laudantium doloremque iusto reiciendis maxime corrupti, asperiores, architecto rem tenetur cum assumenda ex? Cupiditate, nam nemo atque, quas mollitia numquam et iste ipsam nulla, consequuntur laborum labore nesciunt cumque quos? Facere molestias impedit earum pariatur facilis deleniti voluptatem adipisci quam! Voluptas at sed modi iste cumque delectus ipsa esse atque nulla inventore animi temporibus, nisi nobis consequatur error! Adipisci in aspernatur id rem labore unde praesentium, cupiditate maxime voluptates nisi, asperiores libero corporis illo similique eum consequatur sapiente inventore. Velit laboriosam aliquam aspernatur quibusdam qui illo dolore, dolorem possimus, deserunt unde eum mollitia omnis consequuntur assumenda? Sed, fugiat suscipit distinctio amet itaque reiciendis quibusdam provident, cum molestiae magni vero enim. Officiis alias, nisi quos eligendi iure adipisci neque minima tenetur, dolorem repudiandae enim eveniet!
        </p>
      </div>

      <AsideRight>
        aside right
      </AsideRight>
    </>
  );
};

export default Page;


const FeedsNav = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Cambiado a HTMLDivElement

  const {
    scrollPosition,
    scrollToLeft,
    scrollToRight,
    showButtonLeft,
    showButtonRight
  } = useScroll(scrollContainerRef);

  return (
    <div className="w-full relative">
      <div
        ref={scrollContainerRef} // Aquí no hay problemas, ya que es un HTMLDivElement
        className="flex justify-start items-center overflow-x-auto space-x-4 p-4 w-full"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex-shrink-0 w-48 h-48 bg-blue-500">Item 1</div>
        <div className="flex-shrink-0 w-48 h-48 bg-red-500">Item 2</div>
        <div className="flex-shrink-0 w-48 h-48 bg-green-500">Item 3</div>
        <div className="flex-shrink-0 w-48 h-48 bg-yellow-500">Item 4</div>
        <div className="flex-shrink-0 w-48 h-48 bg-purple-500">Item 5</div>
      </div>

      {/* Botones de desplazamiento */}
      {showButtonLeft && (
        <button
          onClick={scrollToLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
        >
          Left
        </button>
      )}
      {showButtonRight && (
        <button
          onClick={scrollToRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
        >
          Right
        </button>
      )}
    </div>
  );
};