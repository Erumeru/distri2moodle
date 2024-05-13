/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package equipo.distribuidos.servlet;

import equipo.distribuidos.jwt.ManejoJWT;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;


/**
 *
 * @author COMPUTOCKS
 */
public class LoginServlet extends HttpServlet {
    
    public String sha256(String str) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(str.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("llego al servlet");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String pass= sha256(password);

        try {
            // Construir la URL para la solicitud GET
            String urlString = "http://localhost:3000/api/iniciarSesion-Padre?email=" + URLEncoder.encode(email, "UTF-8") + "&password=" + URLEncoder.encode(pass, "UTF-8");
            URL url = new URL(urlString);

            // Abrir conexión HTTP
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            // Leer la respuesta del servidor
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder responseBuilder = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                responseBuilder.append(inputLine);
            }
            in.close();

            // Verificar si la respuesta contiene contenido
            String responseData = responseBuilder.toString();
            if (!responseData.isEmpty()) {
                ManejoJWT jwtManager = new ManejoJWT();
                String token = jwtManager.crearToken(email); // Usar el email para crear el token

// Convertir la cadena JSON en un objeto JSON
                JSONObject jsonResponse = new JSONObject(responseData);

// Obtener el valor del ID del padre
                int idPadre = jsonResponse.getInt("idPadre");
                // Agregar el token como un atributo al objeto de sesión del usuario
                request.getSession().setAttribute("token", token);
                String jsCode = "<script>localStorage.setItem('idPadre', '" + idPadre + "'); window.location.href='index.html';</script>";

                System.out.println(token);
                // Redirigir al usuario a otro recurso
                //response.sendRedirect("index.html");
                PrintWriter out = response.getWriter();
                out.println(jsCode);
            } else {
                // Si la respuesta está vacía, responder con un mensaje de error
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Error: Respuesta vacía del servidor externo.");
                System.out.println("no se hizo el token");
            }
        } catch (IOException e) {
            //e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            System.out.println("no existes");
        }
        //processRequest(request, response);
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

    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
