export interface Props {
  /** 
   * @description Código/ID do aplicativo Elfsight gerado na plataforma 
   * @default 2aae1ae5-2732-4618-95cc-e00bb3eb88b6
   */
  elfsightAppId?: string;
  
  /** @description Título opcional da seção (fica acima da galeria do Instagram) */
  title?: string;
}

export default function InstagramFeed({ 
  elfsightAppId = "2aae1ae5-2732-4618-95cc-e00bb3eb88b6",
  title 
}: Props) {
  
  if (!elfsightAppId) {
     return null;
  }

  return (
    <div class="w-full flex-col flex items-center justify-center py-8 lg:py-14 px-4 sm:px-5 mx-auto max-w-[1440px] overflow-hidden">
      {/* Título opcional para dar flexibilidade (ex: "Siga a Vic Beauté" ou "@vicbeaute") */}
      {title && (
         <h2 class="text-[#363931] font-Queens text-[32px] lg:text-[40px] mb-6 lg:mb-8 text-center px-4 w-full">
            {title}
         </h2>
      )}
      
      {/* Divisória/Injetor do Elfsight */}
      <div class="w-full relative z-10 transition-opacity duration-300">
         {/* Script de motor externo da Plataforma Elfsight carregado assincronamente */}
         <script src="https://elfsightcdn.com/platform.js" async defer></script>
         
         {/* Container principal que o widget detecta para renderizar a tabela/grid das imagens */}
         <div 
           class={`elfsight-app-${elfsightAppId} w-full min-h-[300px] flex items-center justify-center`} 
           data-elfsight-app-lazy={true}
         >
         </div>
      </div>
    </div>
  );
}
