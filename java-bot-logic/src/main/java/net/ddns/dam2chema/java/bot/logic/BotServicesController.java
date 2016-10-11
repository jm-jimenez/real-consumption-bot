/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.ddns.dam2chema.java.bot.logic;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.request.SendMessage;
import java.util.Scanner;

/**
 *
 * @author jmjimenez
 */
public class BotServicesController implements Runnable {

    private TelegramBot bot;
    private boolean stop;

    public BotServicesController(TelegramBot bot) {
        
        this.bot = bot;
        stop = false;
    }

    @Override
    public void run() {
        while (!stop) {
            Scanner lector = new Scanner(System.in);
            String line = lector.nextLine();
            if (line.equalsIgnoreCase("stop")){
                stop = true;
            }
            else if (line.equalsIgnoreCase("message")){
                Integer [] chats = new ServerRequestsDispatcher().getAllChats();
                String message = lector.nextLine();
                for (int chat: chats){
                    bot.execute(new SendMessage(chat, message));
                }
            }
            else if (line.equalsIgnoreCase("reset")){
                Integer [] chats = new ServerRequestsDispatcher().deleteUserData(-1);
                for (int chat : chats){
                    bot.execute(new SendMessage(chat, "Statistics has been reset.\nPlease use /start"));
                }
            }
        }
    }

    public boolean botStop() {
        return stop;
    }
}
