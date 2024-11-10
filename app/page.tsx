"use client";

import AsideRight from '@/components/AsideRight';
import DropdownMenu from '@/components/DropdownMenu';
import AuthModal from '@/components/modal/AuthModal';
import useScroll from '@/hooks/useScroll';
import useUser from '@/hooks/useUser';
import generateSqid from '@/utils/generateSqid';
import { signOut, useSession } from 'next-auth/react';
import { useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';

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
        <FeedsNav />

        <DropdownMenu
          button={<button className='dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'><BsThreeDots /></button>}
          positionX='left'
        >
          {(MenuRef, menu, setMenu) => (
            <>
              {menu && <div ref={MenuRef} className='py-1 bg-neutral-800 rounded-lg overflow-hidden'>
                <div onClick={() => {
                  setMenu(!menu)
                }} className='w-max px-3 py-2 bg-neutral-800 active:brightness-95 cursor-pointer hover:bg-neutral-700'>Clear all bookmarks</div>
              </div>}
            </>
          )}
        </DropdownMenu>

        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint quod enim mollitia, obcaecati natus libero aliquid provident doloremque quis molestiae? Perferendis deserunt molestiae illum voluptate, id, nihil fugit quis quia illo cumque soluta aut iste nobis veritatis possimus. Rem illo quibusdam labore dolorum laudantium quod? Reprehenderit ipsa porro rerum illo? Cum ad incidunt doloremque magnam odio doloribus iusto tempora aliquam! Rem iure facilis exercitationem? Corrupti, animi voluptatum iste alias et ullam? Mollitia nam ducimus praesentium natus at commodi? Numquam aperiam, excepturi corporis labore neque saepe minima deserunt aliquid? Non officia repellendus aut porro totam minus saepe quos quod, nesciunt nemo, iusto, dolorem provident? Aliquam, facilis perferendis. Nemo rerum saepe fuga quibusdam iste nostrum aperiam ducimus odit earum dolores, unde facere necessitatibus temporibus deleniti delectus possimus vel quas quo provident vero a nesciunt sequi exercitationem soluta! Ratione sunt soluta, unde beatae libero, vero magnam ab voluptatum laboriosam magni dolorum sapiente repellendus odio odit laudantium sint cupiditate id doloribus aliquid eius! Amet sapiente dolor quos et magni dolores, necessitatibus velit similique quas. Eius dolore expedita modi voluptas, iusto maxime quas at repellendus, tempore voluptatem neque nesciunt mollitia ullam corrupti voluptate. Amet distinctio placeat officia reiciendis minima esse quis, corrupti fugiat veritatis dolores, ea atque in explicabo ipsa doloremque nemo architecto asperiores iure assumenda ducimus modi at vel harum! Quos eveniet necessitatibus, vel, veritatis ab obcaecati consectetur dolore debitis esse aliquid quidem adipisci repudiandae aliquam amet ullam molestias, quaerat voluptates magnam quam quibusdam soluta tempora culpa earum. Numquam nam voluptatem illo provident amet repellendus magnam? Officia eaque eius in nobis necessitatibus quisquam, illum temporibus earum sunt nisi eos blanditiis praesentium nulla dignissimos omnis voluptatem! Laudantium eius corrupti quisquam aliquam maxime fugit nulla soluta libero. Labore autem, exercitationem voluptatibus fuga nemo neque quas in est tenetur, iste similique minima cupiditate cumque voluptate cum quo animi. Repellendus labore reprehenderit molestiae ipsam hic eos quasi impedit autem tenetur voluptas nostrum corrupti nam rem harum quae omnis soluta ratione delectus nemo numquam inventore nobis distinctio, nisi provident. Ipsum cumque reiciendis, sapiente aut suscipit ad nemo voluptatum ducimus eum omnis ea laudantium vitae, animi culpa, vero error. Incidunt corporis totam ullam asperiores neque necessitatibus nulla odit pariatur, repellat nemo ad fugiat officiis non dicta autem vitae facilis illo maxime provident tenetur deserunt excepturi recusandae harum eligendi. Tempore dicta numquam aperiam doloribus excepturi! Nobis voluptatem saepe facilis ipsam nihil dolorum dignissimos excepturi. Dolores ipsum, quam fugiat magnam officiis unde deleniti sunt beatae doloribus illo aliquam! Dolorum, natus officiis eveniet, tempora, culpa optio voluptas debitis molestiae perferendis mollitia delectus magnam corrupti sequi. Eveniet porro aspernatur eius. Non reprehenderit minus, id sed laboriosam, voluptates nobis ratione expedita ipsam accusamus quos laborum saepe nostrum? Quod suscipit culpa, eum facilis alias ipsa impedit rerum. Sint incidunt dicta ullam deleniti, dolor facilis non! Adipisci deserunt minus quas, sint sequi iure modi optio? Natus, perspiciatis distinctio? Nulla perferendis iusto exercitationem repellat? Veniam sunt rem, odit porro deserunt soluta esse rerum repellendus iste dolores? Id molestiae laborum, similique laudantium mollitia provident, voluptas eius cumque, iste veritatis rerum voluptates distinctio! Aliquid, veniam tempore? Dolorum, eveniet aut. Ad obcaecati esse eos nobis doloribus dolorem laudantium aliquam eligendi corporis, maxime consequuntur ratione voluptate eaque cupiditate facilis doloremque a id reprehenderit ab quae assumenda. Culpa excepturi aut iure explicabo, ipsum ut assumenda consequatur harum voluptatibus repellendus corporis repudiandae rem praesentium odit doloremque molestiae placeat doloribus minima maxime sapiente blanditiis eaque cupiditate, eveniet adipisci. Quia nihil nobis veritatis minima ad sint consequatur animi debitis sed! Sit mollitia placeat, obcaecati dolor nam consequatur. Animi iusto numquam molestias voluptatem vitae! Atque hic officia sint doloribus non cumque eligendi asperiores tempore repudiandae expedita amet eius tempora itaque, adipisci perspiciatis esse laudantium architecto earum dicta alias laboriosam consectetur! Libero ea doloribus mollitia tempora, voluptatum quam. Voluptatibus aspernatur nostrum reiciendis est totam quasi similique. Quam distinctio fuga delectus odit expedita sunt totam. Deleniti officia voluptas, inventore consequuntur voluptatibus corrupti alias id animi delectus perspiciatis neque maxime culpa odio repudiandae eligendi totam nostrum quae, illo nulla cum doloribus dolorem! Quia, sit! Ipsam eveniet ex numquam veniam hic modi dolores eum eaque. Iusto non placeat vel porro maiores ipsa, veniam quaerat nulla dolorum sed consequatur voluptatem nemo tempore neque mollitia distinctio rerum quidem? Dignissimos soluta aspernatur, sequi amet illum voluptatum eveniet expedita natus laudantium a quas nisi maiores repellendus reiciendis molestiae dolore quae velit excepturi dolores non totam quos rem. Incidunt, ratione, sapiente tenetur ipsum magnam ipsa deserunt sint, quis aperiam nisi eveniet tempore. Nisi animi ut quis quibusdam architecto tempore in omnis? Commodi ipsum officia ipsam ullam ea atque ab delectus quaerat sunt similique asperiores molestiae magnam reprehenderit, odit, maxime explicabo nemo accusamus pariatur earum quisquam recusandae porro hic fuga. Deserunt distinctio ex aperiam, temporibus, ullam quas libero ad doloremque beatae enim repellat non laborum deleniti, perspiciatis explicabo dolorem? Dolorum repellat voluptate consectetur aut, expedita incidunt? Autem dolores commodi architecto temporibus magni est ea reprehenderit. Provident, et temporibus autem similique debitis facere molestiae esse. Iure facilis consequatur vitae itaque, commodi reiciendis magnam iste, saepe perspiciatis dolores quod odit! Architecto ipsa tenetur delectus alias dolorum consequuntur voluptatem numquam. Alias fugiat facere, accusamus natus expedita accusantium corporis eaque sint soluta consequatur dignissimos dolor ratione cum voluptate nihil. Laboriosam, tempore optio delectus corporis eius accusantium error non sapiente impedit doloremque enim quas cupiditate dolor, quae sint labore fuga quo exercitationem quaerat dolorem iure. Similique accusamus officia ea facere eveniet, illo est iure, eos, id debitis assumenda illum. Voluptatem, temporibus! Ratione ea magnam consequuntur pariatur quo eveniet quae sit error? Voluptatum vel fugiat in obcaecati dolore porro id pariatur sunt aliquam repellat, eaque unde laborum beatae maxime minus nulla. Porro harum, maiores placeat totam vel ducimus libero blanditiis aut eveniet assumenda laboriosam veritatis dolorum molestiae accusantium nam sed, nihil, minima dignissimos! Unde quaerat officia, voluptates sunt incidunt consectetur ullam suscipit aut facilis doloremque aliquam neque velit facere nisi cum delectus corporis sint necessitatibus quia perferendis eius sed vel. Perspiciatis quis explicabo a quia voluptatibus aspernatur repudiandae quod, ea ducimus sapiente vero dolorum dolores exercitationem ab aliquam vitae quam dicta. Ut, animi.
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