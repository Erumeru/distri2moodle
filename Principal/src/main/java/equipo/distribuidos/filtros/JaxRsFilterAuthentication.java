/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Filter.java to edit this template
 */
package equipo.distribuidos.filtros;

import equipo.distribuidos.jwt.ManejoJWT;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

//import jakarta.ws.rs.WebApplicationException;
//import jakarta.ws.rs.container.ContainerRequestContext;
//import jakarta.ws.rs.container.ContainerRequestFilter;
//import jakarta.ws.rs.core.Response.Status;
/**
 *
 * @author COMPUTOCKS
 */
public class JaxRsFilterAuthentication implements Filter {

    public static final String AUTHENTICATION_HEADER = "Authorization";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Método de inicialización del filtro (opcional)
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // Obtener el método y la URL de la solicitud
        String metodo = req.getMethod();
        String path = req.getServletContext().getContextPath() + req.getServletPath();

        if (metodo.equals("GET") && path.contains("ogin") || path.contains("register") || path.contains("EnviarRecibir.js") || path.contains("enrutarSolicitudes.js") || path.contains("navegacion.js") || path.contains("formularioObtenerHijo.html")){
            System.out.println("Estoy en login");
            // Aquí podrías iDmplementar la lógica para crear el token si es una solicitud de inicio de sesión
        } else {
            // Verificar si se proporciona un token de autenticación en la solicitud
            String token = (String) req.getSession().getAttribute("token");
            if (token != null) {
                ManejoJWT jwtManager = new ManejoJWT();
                Boolean verificacion = jwtManager.verificarToken(token);
                if (verificacion) {
                    System.out.println("Tengo un token validado por el filtro");
                } else{
                    System.out.println("token malito");
                }

                // Aquí podrías implementar la lógica para verificar el token de autenticación
                // Por ejemplo, validar el token para permitir o denegar el acceso
            } else {
                System.out.println("lalalla");
                // Si no se proporciona un token y no es la página de inicio de sesión, enviar un mensaje de error
                res.setContentType("text/plain");
                res.setCharacterEncoding("UTF-8");
                res.getWriter().write("Unauthorized: You are not authorized to access this resource.");
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        // Pasar la solicitud al siguiente filtro en la cadena (o al servlet si no hay más filtros)
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Método de destrucción del filtro (opcional)
    }
}

//    @Override
//    public void filter(ContainerRequestContext requestContext) throws IOException {
//       String metodo = requestContext.getMethod();
//       String path = requestContext.getUriInfo().getPath();
//       
//       if(metodo.equals("POST")&&path.contains("login")){
//           // aqui creo el token
//       } else{
//           String token = requestContext.getHeaderString(AUTHENTICATION_HEADER);
//           if(token!=null){
//               // aqui verifico el token
//           }else{
//               throw new WebApplicationException(Status.UNAUTHORIZED);
//           }
//       }
//    }
    
//}
