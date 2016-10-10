/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.ddns.dam2chema.java.bot.logic;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.TelegramBotAdapter;
import com.pengrad.telegrambot.model.Chat;
import com.pengrad.telegrambot.model.Message;
import com.pengrad.telegrambot.model.Update;
import com.pengrad.telegrambot.model.User;
import com.pengrad.telegrambot.model.request.ForceReply;
import com.pengrad.telegrambot.request.GetUpdates;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.GetUpdatesResponse;
import java.util.List;

/**
 *
 * @author jmjimenez
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        
        boolean awaitsForData = false;
        
        BotServicesController botServicesController = new BotServicesController();
        new Thread(botServicesController).start();
        
        TelegramBot bot = TelegramBotAdapter.build("240637070:AAH3Pv4_6i2e6LTY3LscBdLGb8SxRqhjAn8");

        int offset = 0;
        SendMessage sendMessage;
        
        while (!botServicesController.botStop()){
            GetUpdates getUpdates = new GetUpdates().offset(offset);
            GetUpdatesResponse getUpdatesResponse = bot.execute(getUpdates);
            List <Update> updates = getUpdatesResponse.updates();
            
            for (Update u : updates){
                System.out.println(u);
                offset = u.updateId() + 1;
                Message message = u.message();
                User user = message.from();
                Chat chat = message.chat();
                
                switch (message.text()){
                    case "/start":
                        switch (new ServerRequestsDispatcher().checkUserData(user.id())){
                            case "0":
                                sendMessage = new SendMessage(chat.id(), "No records found.\nInsert your current odometer: ");
                                awaitsForData = true;
                                bot.execute(sendMessage);
                                break;
                        }
                        break;
                        
                    default:
                        if (awaitsForData){
                            new ServerRequestsDispatcher().setCurrentOdometer(user.id(), message.text());
                            awaitsForData = false;
                            sendMessage = new SendMessage(chat.id(), "You are all up to begin.\nUse /help to show the command list.");
                            bot.execute(sendMessage);
                        }
                }
            }
            
        }
    }
    
}
