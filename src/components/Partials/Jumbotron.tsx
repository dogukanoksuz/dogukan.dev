import * as React from 'react';

export default function Jumbotron() {
    return (
        <section className="py-12 px-5 text-center my-background mb-24">
            <div className="w-full max-w-2xl mx-auto">
                <h2 className="text-5xl dark:text-gray-300 mt-2 mb-6 leading-tight font-semibold font-heading">
                    Doğukan Öksüz
                </h2>
                <p className="mb-8 text-gray-600 leading-relaxed dark:text-gray-300">
                    Ben Doğukan, yazılım mühendisiyim. Web teknolojileri ve Linux üzerine
                    yazılımlar geliştiriyorum. Backend geliştirmede kendime güvendiğim kadar
                    frontend üzerinde de kararlı yazılımlar geliştiriyorum. PHP, Javascript,
                    Python, Golang, NodeJS, Tailwind, Laravel ve Linux konuları üzerinde
                    çalışmalar yapmaktayım.
                </p>
                <div>
                    <a
                        className="inline-block py-4 px-8 mr-6 leading-none text-white bg-red-500 hover:bg-red-700 font-semibold rounded shadow"
                        href="#"
                    >
                        İletişime geç
                    </a>
                    <a className="text-red-600 hover:underline" href="#anchor">
                        Makalelere göz at
                    </a>
                </div>
                <div id="anchor" />
            </div>
        </section>
    );
}
