import { resend } from "../lib/resend";
import { env } from "../config/env";

interface SendManageLinkEmailInput {
  to: string;
  capsuleTitle: string;
  manageUrl: string;
}

/**
 * Envia o link de gerenciamento da cápsula por e-mail. Isso NÃO é um
 * sistema de login — é só uma rede de segurança pra quem perdeu o
 * acesso (localStorage limpo, troca de dispositivo, etc). O link em si
 * já contém o editToken como credencial; o e-mail é só uma forma de
 * entregar esse link de volta pra quem o perdeu.
 *
 * Erros de envio são logados mas não lançados — uma falha no e-mail não
 * deve quebrar a confirmação de pagamento, que é o fluxo crítico real.
 */
export async function sendManageLinkEmail({
  to,
  capsuleTitle,
  manageUrl,
}: SendManageLinkEmailInput): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: `Sua cápsula "${capsuleTitle}" está pronta! 🎉`,
      html: buildEmailHtml({ capsuleTitle, manageUrl }),
    });

    if (error) {
      console.error("Falha ao enviar e-mail via Resend:", error);
    }
  } catch (error) {
    console.error("Erro inesperado ao enviar e-mail:", error);
  }
}

function buildEmailHtml({
  capsuleTitle,
  manageUrl,
}: {
  capsuleTitle: string;
  manageUrl: string;
}): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; background: #0b0809; color: #f3ece7; padding: 32px; border-radius: 16px;">
      <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #fb7185; margin: 0 0 12px;">
        Pagamento confirmado
      </p>
      <h1 style="font-size: 22px; margin: 0 0 16px;">Sua cápsula "${capsuleTitle}" está ativa! 🎉</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #d5c9c1;">
        Guarde este e-mail — o link abaixo é o seu acesso para editar a cápsula
        (adicionar fotos, música, etc.) e pegar o link público para compartilhar.
      </p>
      <a href="${manageUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 28px; background: linear-gradient(to right, #e11d48, #f43f5e); color: white; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 14px;">
        Gerenciar minha cápsula
      </a>
      <p style="font-size: 12px; color: #71717a; margin-top: 24px;">
        Se você não reconhece essa cápsula, pode ignorar este e-mail.
      </p>
    </div>
  `;
}
