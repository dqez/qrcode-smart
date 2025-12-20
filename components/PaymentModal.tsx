/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface PaymentModalProps {
  isOpen: boolean;
  closeModal: () => void;
  planName: string;
  amount: number;
  userId: string;
}

export default function PaymentModal({ isOpen, closeModal, planName, amount, userId }: PaymentModalProps) {
  const transferContent = `SEVQR ${userId}`;
  // Using SePay's QR generator format: https://qr.sepay.vn/img?acc=SO_TK&bank=TEN_NH&amount=SO_TIEN&des=NOI_DUNG
  const bankAccount = "101877455638"; // Example
  const bankName = "VietinBank"; // Example
  const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankName}&amount=${amount}&des=${transferContent}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all border border-neutral-200 dark:border-neutral-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-neutral-900 dark:text-neutral-100 flex justify-between items-center"
                >
                  <span>Upgrade to {planName}</span>
                  <button onClick={closeModal} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div className="flex justify-center bg-white p-4 rounded-xl border border-neutral-200">
                    <img src={qrUrl} alt="Payment QR Code" className="w-full max-w-62.5 h-auto" />
                  </div>

                  <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span>Bank:</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{bankName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span>Account Number:</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{bankAccount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span>Amount:</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</span>
                    </div>
                    <div className="flex flex-col gap-1 py-2">
                      <span>Transfer Content (Memo):</span>
                      <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg font-mono text-xs sm:text-sm break-all">
                        <span className="flex-1 font-bold text-neutral-900 dark:text-neutral-100">{transferContent}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(transferContent)}
                          className="text-indigo-600 hover:text-indigo-700 text-xs font-medium"
                        >
                          COPY
                        </button>
                      </div>
                      <p className="text-xs text-red-500 mt-1">* Important: You must enter the exact transfer content for the system to process automatically.</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                    <p>After transferring, please wait 1-2 minutes. The system will automatically upgrade your account.</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
