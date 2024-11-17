"use client"

import { getUserData } from '@/utils/fetchFunctions';
import { useSession } from 'next-auth/react';
import React from 'react'
import { FaCircleCheck } from 'react-icons/fa6';
import { useQuery } from 'react-query';

const page = ({ params }: { params: { username: string } }) => {
  const { data: session } = useSession()

  const { data: user, isLoading, error } = useQuery(
    ['userProfile', params.username],
    () => getUserData(params.username),
    {
      enabled: !!params.username,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      onSuccess: (data) => console.log(data),
      onError: (err) => console.log(err)
    },
  );

  if (isLoading) return <div>loading</div>

  if (error) return <div>Error fetching user data</div>

  return (
    <div>
      {/* banner and pfp */}
      <div className="relative w-full block">
        <div className="w-full min-h-20 max-h-24 pb-[56%] absolute -top-3 left-0">
          <img className='w-full object-cover h-full rounded-b-lg' src='https://thumb.ac-illust.com/de/de03943d3658e11b1f2331796927b26e_t.jpeg' />
          <div className='absolute left-3 top-1/3 w-40 h-40 rounded-full overflow-hidden shadow-lg'>
            <img src={user?.profileImage || "/default_pfp.jpg"} className='w-full h-full cursor-pointer hover:brightness-90 duration-100' />
          </div>
        </div>
      </div>
      <div className='pt-[40%] px-4'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum autem, dolores dicta obcaecati corporis aspernatur excepturi earum accusantium minima quo corrupti voluptates eligendi dolore nihil veritatis inventore atque omnis, possimus maxime ipsa? Odit perspiciatis accusamus, doloremque fugit dolore inventore aliquid aliquam reprehenderit aut distinctio similique molestias, numquam architecto tempora voluptas quisquam, nisi veniam facilis commodi amet doloribus sed autem quibusdam! Odit, optio? Molestias iure eligendi consectetur. Ex fugiat dolor cupiditate delectus ad ut sit ab iusto distinctio, tenetur, laborum rem labore a iste mollitia excepturi similique praesentium eum. Hic voluptatibus odio quasi vitae blanditiis dolores. Optio similique officia eius, voluptatum quisquam quasi vitae exercitationem repellendus ad eum praesentium, delectus excepturi dolores modi sapiente soluta eaque natus! Perferendis amet neque maxime repellat cumque nobis accusantium velit doloribus quo dignissimos iure reprehenderit, asperiores, necessitatibus ipsum commodi vero, dolorum cum quibusdam voluptatem quidem! Voluptate suscipit quas harum ea sunt facilis eos deserunt. Vitae blanditiis rerum id reiciendis voluptatum ipsum magnam delectus soluta beatae, quae, odit quaerat recusandae maxime. Velit ullam eaque facere at, maiores numquam nostrum voluptas aspernatur dicta voluptate doloribus voluptatibus fugiat delectus maxime hic expedita quam saepe sequi porro voluptatem? Adipisci amet culpa sed maiores quibusdam tempore sunt temporibus neque, tempora mollitia beatae deleniti ipsum laboriosam non ex dolores, eum aliquid impedit placeat animi? Incidunt distinctio consequuntur, aspernatur quisquam repellendus eveniet, numquam corrupti quia corporis unde animi fugiat quaerat. Laudantium voluptatibus a dolorem ipsum rerum nam, cupiditate consectetur vitae expedita ab temporibus, fugit, eaque et. Quas laudantium architecto quasi, modi quam illum, ducimus repudiandae veniam animi aliquam eaque neque voluptatem provident libero adipisci quibusdam obcaecati! Quaerat culpa rerum magnam voluptatem qui incidunt id quibusdam modi labore eligendi eum inventore dolorum quidem suscipit commodi, et provident deserunt distinctio. At natus, hic nostrum quae enim doloribus. Eligendi laborum, laboriosam repellendus hic odit sit debitis impedit iure sunt est natus animi cum doloribus eveniet amet sequi excepturi explicabo beatae vel. Quisquam, earum necessitatibus est quo sit repellendus eligendi dicta eum molestias accusantium. Cumque consequatur aperiam laborum maiores quos deleniti illum. Expedita numquam necessitatibus molestias cum eum dolore quasi fugiat sint! Sint adipisci possimus eius atque eum minus odit quasi fugit maiores libero at consequuntur, ipsam neque, consequatur repudiandae. Perferendis fugiat, iure dolores saepe culpa sequi eaque beatae voluptatum libero quod. Nesciunt, saepe dolorem impedit blanditiis delectus accusamus assumenda praesentium dolores optio debitis natus eligendi odit. Error quam rerum quas illum facilis sapiente, dignissimos quia commodi vero quae in laboriosam voluptas ducimus porro. Soluta animi sed reprehenderit eos commodi! Obcaecati nulla quaerat totam, sunt harum impedit nostrum iusto ad earum sequi dicta dignissimos possimus et. Ipsum veritatis rem doloremque officiis dolorem adipisci voluptas quasi tempore dolorum, voluptates earum excepturi eius facere accusamus exercitationem, delectus magnam. Dignissimos soluta molestias maiores, repellat voluptatem odio quos enim veniam accusamus eveniet odit, explicabo quia deserunt architecto iure dolores minima! Commodi, architecto. Veritatis, repudiandae? Architecto natus illo, ratione quisquam necessitatibus at tempore aut earum soluta omnis quos dolor magni accusamus distinctio ipsam rem quam quas tempora officia, unde sunt. Doloribus sint deleniti recusandae libero eum temporibus facilis ad, delectus at ducimus assumenda. Animi, ea delectus. Velit quis dolores doloremque earum ut aperiam mollitia placeat possimus, necessitatibus magnam. Ipsam officia, dolores officiis quis omnis quidem libero nisi sed aperiam, quaerat modi molestiae porro ullam hic cum accusantium quisquam architecto minus vel sint repudiandae obcaecati provident esse maiores! Ut doloribus est ad ex! Architecto, minus dignissimos possimus accusantium, dolor dolorem culpa repudiandae laudantium odit sed inventore. Pariatur magnam qui consequatur sed perferendis unde impedit. Nam reprehenderit repudiandae eius dolore, porro facere dolores delectus debitis impedit quia! Debitis blanditiis totam nemo, earum laborum nobis ducimus numquam ut quaerat vitae id beatae reiciendis explicabo ipsa. Explicabo itaque molestias aliquid quae, veritatis aspernatur deleniti labore delectus cum ex repellendus non possimus sint temporibus doloremque omnis ut earum adipisci consequuntur consequatur doloribus minima officia sed? Accusamus molestiae incidunt praesentium id minus minima, inventore odit dolores veniam fugiat modi vitae tempora quidem labore saepe hic magnam nesciunt voluptates earum sunt expedita laborum quis! Dolores iure aliquid aliquam aut cupiditate ut, iste officia magnam laudantium nulla explicabo vero inventore eveniet! Cumque, illo voluptas provident unde dicta, excepturi, voluptatem nesciunt neque tempore ratione nulla! Cupiditate reiciendis architecto ab provident corporis. Itaque sunt facere quae obcaecati voluptatibus esse reprehenderit dolore in voluptates, asperiores totam omnis non suscipit porro, eligendi minima quis illum iste hic aliquam veniam ea, atque consequatur. Placeat laborum eveniet atque ex voluptatem amet nulla quo quod harum, dolores iusto quia quibusdam ullam esse. Ipsam, libero animi nihil impedit expedita eos quos dicta a voluptatem, modi maiores. Facilis molestiae praesentium ducimus possimus aperiam sit officiis tenetur veniam iure assumenda? Earum nostrum quos error quo voluptatem obcaecati eligendi laboriosam adipisci voluptate qui aperiam, inventore quidem asperiores quia, consectetur possimus accusamus! Optio nam iusto unde quidem assumenda illum consequuntur rem laudantium reprehenderit numquam impedit consequatur totam, quia dolor? Minima rem veritatis vero repellat sunt voluptas assumenda. Omnis illo optio suscipit iusto, a earum itaque molestiae corrupti perferendis officia harum possimus dolore fugit laudantium sed cumque rerum laboriosam ad libero odio repellendus ipsa doloribus beatae quisquam? Praesentium vel neque distinctio consectetur ea officiis, repudiandae dolor dolore odio temporibus laudantium beatae sed, veniam sapiente nisi! Placeat consequuntur mollitia vero dolorum assumenda tenetur repellendus voluptas eos blanditiis voluptate in earum nulla aut, sed, fugiat ad deleniti ut commodi ullam aliquid porro explicabo optio, illo ipsum? Veniam dolorem officia provident, cupiditate animi nulla aspernatur earum similique rem explicabo corporis culpa incidunt enim ducimus! Officia, quos eaque! Magni eligendi minus quibusdam sequi omnis explicabo, consectetur quaerat odit voluptatum incidunt recusandae enim reiciendis fugiat vitae dicta sapiente, cumque necessitatibus quisquam? Minus quibusdam vitae fugit accusantium cupiditate molestias corporis voluptatum ratione eligendi expedita temporibus facilis natus, culpa quaerat. Quasi esse, possimus quis dolores odit eius nisi sapiente natus facilis labore dolorum blanditiis velit voluptatem laudantium beatae facere earum tempore nobis, perspiciatis voluptatibus deserunt quisquam? Deleniti fugiat adipisci, quasi, non, hic est commodi iusto illum officiis porro harum earum? Ipsa amet suscipit accusamus eum harum, aliquid saepe dignissimos.
      </div>
    </div>
  )
}

export default page