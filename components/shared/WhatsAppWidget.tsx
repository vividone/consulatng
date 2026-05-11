import { SITE } from "@/lib/constants";

export function WhatsAppWidget() {
  return (
    <a
      href={SITE.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Consulat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.792 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.86 2.722.86.99 0 1.96-.732 2.222-1.7.156-.575.156-1.04-.103-1.17-.244-.13-1.806-.86-2.118-.86zm-2.55 10.78c-1.815 0-3.6-.487-5.157-1.404l-.371-.215-3.81 1.003 1.022-3.733-.244-.39c-1.003-1.602-1.534-3.46-1.534-5.347 0-5.529 4.482-10.024 9.985-10.024 2.679 0 5.186 1.04 7.077 2.94a9.93 9.93 0 0 1 2.93 7.083c0 5.528-4.494 10.087-9.898 10.087zm8.515-18.6c-2.262-2.262-5.298-3.51-8.515-3.51-6.654 0-12.075 5.422-12.075 12.075 0 2.118.56 4.197 1.62 6.038L4 28.7l4.97-1.303a12.005 12.005 0 0 0 5.762 1.47h.013c6.65 0 12.165-5.42 12.165-12.075 0-3.225-1.36-6.255-3.623-8.517z" />
      </svg>
    </a>
  );
}
