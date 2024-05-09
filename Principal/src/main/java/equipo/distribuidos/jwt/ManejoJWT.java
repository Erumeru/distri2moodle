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

    public String crearToken(String user) {
        String token = null;

        try {
            Algorithm algoritmo = Algorithm.HMAC256("secret");
            token = JWT.create().withIssuer("auth0")
                    .withClaim("user", user).sign(algoritmo);
        } catch (JWTCreationException exception) {

        }
        return token;
    }

    private void verificarToken(String token){
        try{
        Algorithm algoritmo = Algorithm.HMAC256("secret");
        JWTVerifier verificador = JWT.require(algoritmo)
                .withIssuer("auth0").build();
        DecodedJWT jwt = verificador.verify(token);
        }catch (JWTVerificationException exception){
            
        }
    }
}
