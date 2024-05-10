/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package equipo.distribuidos.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

/**
 *
 * @author COMPUTOCKS
 */
public class ManejoJWT {

    private static final String SECRET_KEY = "clave_secreta";

    public String crearToken(String user) {
        String token = null;

        try {
            Algorithm algoritmo = Algorithm.HMAC256(SECRET_KEY);
            token = JWT.create().withIssuer("auth0")
                    .withClaim("user", user).sign(algoritmo);
        } catch (JWTCreationException exception) {

        }
        return token;
    }

    public Boolean verificarToken(String token) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(SECRET_KEY);
            JWTVerifier verificador = JWT.require(algoritmo)
                    .withIssuer("auth0").build();
            DecodedJWT jwt = verificador.verify(token);
            return true;
        } catch (JWTVerificationException exception) {

        }
        return false;
    }

    public String obtenerEmailUsuarioDesdeToken(String token) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(SECRET_KEY);
            JWTVerifier verificador = JWT.require(algoritmo)
                    .withIssuer("auth0")
                    .build();
            DecodedJWT jwt = verificador.verify(token);
            return jwt.getClaim("user").asString(); 
        } catch (JWTVerificationException exception) {
            // Manejar la excepción si ocurre al verificar y decodificar el token
            return null;
        }
    }
}
