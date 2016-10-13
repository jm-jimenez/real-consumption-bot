/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.ddns.dam2chema.java.bot.logic;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

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
    
    public boolean setCurrentOdometer(int userId, String odo, long chatId, String firstName){
        RequestBody rb = RequestBody.create(JSON, "{\"userId\" : " + userId + ", \"odo\" : " + odo + ", \"chatId\" : " + chatId + ", \"firstName\" : \"" + firstName + "\"}");
        String data = sendRequest("setCurrentOdometer", rb);
        return Boolean.valueOf(data);
    }
    
    public boolean newRefuel(int userId, String odo, String litres, String euros, String full){
        int f = full != null ? 1 : 0;
        RequestBody rb = RequestBody.create(JSON, "{\"userId\" : " + userId + ", \"odo\" : " + odo + ", \"litres\" : " + litres + ", \"euros\" : " + euros + ", \"full\" : " + f + "}");
        String data = sendRequest("newRefuel", rb);
        return Boolean.valueOf(data);
    }
    
    public double globalMileage (int userId){
        
        RequestBody rb = RequestBody.create(JSON, "{\"userId\" : " + userId + "}");
        String data = sendRequest("globalMileage", rb);
        Map <String, Double> map = new Gson().fromJson(data, new TypeToken<HashMap<String, Double>>(){}.getType());
        return map.get("mileage");
    }
    
    public Integer [] getAllChats(){
        
        RequestBody rb = RequestBody.create(JSON, "{}");
        String data = sendRequest("getAllChats", rb);
        Integer [] salas = new Gson().fromJson(data, Integer[].class);
        return salas;
    }
    
    public Integer [] deleteUserData (int userId){
        System.out.println(userId);
        Integer [] chats = getAllChats();
        RequestBody rb = RequestBody.create(JSON, "{\"userId\" : " + userId + "}");
        sendRequest("deleteUserData", rb);
        return chats;
    }
    
    public HashMap<String, Object[]> partialMileage (int userId, int numberOfResults){
        RequestBody rb = RequestBody.create(JSON, "{\"userId\" : " + userId + ", \"limit\" : " + numberOfResults + "}");
        String data = sendRequest("partialMileage", rb);
        HashMap <String, Object[]> map = new Gson().fromJson(data, new TypeToken<HashMap<String, Object[]>>(){}.getType());
        return map;
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
