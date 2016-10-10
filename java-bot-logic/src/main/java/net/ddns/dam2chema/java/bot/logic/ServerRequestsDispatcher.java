/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.ddns.dam2chema.java.bot.logic;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okio.ByteString;

/**
 *
 * @author jmjimenez
 */
public class ServerRequestsDispatcher {
    
    private MediaType JSON;
    private OkHttpClient client;
    
    public ServerRequestsDispatcher(){
        
        JSON = MediaType.parse("application/json; charset=utf-8");
        client = new OkHttpClient(); 
    }
    
    public String checkUserData(int userId){
        RequestBody rb = RequestBody.create( JSON, "{\"userId\" : " + userId + "}" );
        String data = sendRequest("checkUserData", rb);
        return data;
    }
    
    public boolean setCurrentOdometer(int userId, String odo){
        RequestBody rb = RequestBody.create(JSON, "{\"userId\" : " + userId + ", \"odo\" : " + odo + "}");
        String data = sendRequest("setCurrentOdometer", rb);
        return Boolean.valueOf(data);
    }
    
    public boolean newRefuel(int userId, String odo, String litres, String euros){
        RequestBody rb = RequestBody.create(JSON, "{\"userId\" : " + userId + ", \"odo\" : " + odo + ", \"litres\" : " + litres + ", \"euros\" : " + euros + "}");
        String data = sendRequest("newRefuel", rb);
        return Boolean.valueOf(data);
    }
    
    private String sendRequest (String path, RequestBody rb){
        Request request = new Request.Builder()
                .url("http://localhost:3000/" + path)
                .post(rb)
                .build();
        String response = "";
        try {
            Response resp = client.newCall(request).execute();
            response = resp.body().string();
            
        } catch (IOException ex) {
            Logger.getLogger(ServerRequestsDispatcher.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        return response;
    }
}
