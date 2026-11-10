import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/iniciar-sesion/",
        "/*/login/",
        "/*/registro/",
        "/*/register/",
        "/*/olvidaste-contrasena/",
        "/*/forgot-password/",
        "/*/restablecer-contrasena/",
        "/*/reset-password/",
        "/*/dashboard/",
        "/*/perfil/",
        "/*/profile/",
        "/*/design-system/",
        "/*/cursos/_/",
        "/*/courses/_/",
        "/*/cursos/*/lecciones/",
        "/*/courses/*/lessons/",
      ],
    },
    sitemap: `${siteOrigin()}/sitemap.xml`,
    host: siteOrigin(),
  };
}
