import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Logo from "./Logo";

interface IMobileMenuProps {
  children: React.ReactNode;
  mode: string;
}

const MobileMenu = (props: IMobileMenuProps) => {
  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  function openModal() {
    setOpen(true);
  }

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <div onClick={openModal}>{props.children}</div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/25 opacity-100 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md bg-white dark:bg-black">
                    <button
                      type="button"
                      className="absolute right-6 top-5 flex items-center justify-center"
                      onClick={closeModal}
                    >
                      <XMarkIcon className="h-8 w-8 text-slate-700 dark:text-gray-400" />
                    </button>

                    <nav className="divide-y divide-slate-900/10 text-base leading-7 text-slate-900 dark:text-gray-400">
                      <div className="px-6 py-2">
                        <Link
                          className="block w-9 overflow-hidden"
                          href="/"
                          onClick={closeModal}
                        >
                          <Logo mode={props.mode} />
                        </Link>
                      </div>
                      <div className="px-8 py-6">
                        <div className="-my-2 items-start space-y-2">
                          <Link
                            className="block w-full py-2 font-semibold"
                            href="/page/ben-kimim"
                            onClick={closeModal}
                          >
                            Hakkımda
                          </Link>
                          <Link
                            className="block w-full py-2 font-semibold"
                            href="/page/referanslar"
                            onClick={closeModal}
                          >
                            İşler
                          </Link>
                          <Link
                            className="block w-full py-2 font-semibold"
                            href="/page/iletisim"
                            onClick={closeModal}
                          >
                            İletişim
                          </Link>
                        </div>
                      </div>
                    </nav>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default MobileMenu;
