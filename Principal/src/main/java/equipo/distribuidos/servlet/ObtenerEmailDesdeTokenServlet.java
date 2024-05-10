/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package equipo.distribuidos.servlet;

import com.google.gson.Gson;
import equipo.distribuidos.jwt.ManejoJWT;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

/**
 *
 * @author COMPUTOCKS
 */
public class ObtenerEmailDesdeTokenServlet extends HttpServlet {

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("llego al sevlet q limpia tpoken");

        // Obtener el token de la sesión
        HttpSession session = request.getSession();
        String token = (String) session.getAttribute("token");
        
        System.out.println(token);

        if (token == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        ManejoJWT jwt = new ManejoJWT();
        // Obtener el email del usuario desde el token
        String email = jwt.obtenerEmailUsuarioDesdeToken(token);
        System.out.println(email);

        // Enviar el email como respuesta JSON
        Map<String, String> respuesta = Map.of("email", email);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(respuesta));

    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    // @Override
    /*    public String getServletInfo() {
    return "Short description";*/
    //   }// </editor-fold>
}
