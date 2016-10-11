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
import com.pengrad.telegrambot.model.request.InlineKeyboardButton;
import com.pengrad.telegrambot.model.request.InlineKeyboardMarkup;
import com.pengrad.telegrambot.model.request.Keyboard;
import com.pengrad.telegrambot.model.request.KeyboardButton;
import com.pengrad.telegrambot.model.request.ReplyKeyboardMarkup;
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

        TelegramBot bot = TelegramBotAdapter.build("240637070:AAH3Pv4_6i2e6LTY3LscBdLGb8SxRqhjAn8");
        BotServicesController botServicesController = new BotServicesController(bot);
        
        new Thread(botServicesController).start();

        int offset = 0;
        SendMessage sendMessage;

        while (!botServicesController.botStop()) {
            GetUpdates getUpdates = new GetUpdates().offset(offset);
            GetUpdatesResponse getUpdatesResponse = bot.execute(getUpdates);
            List<Update> updates = getUpdatesResponse.updates();

            for (Update u : updates) {
                System.out.println(u);
                offset = u.updateId() + 1;
                Message message = u.message(); //message can be null if it's a callbackquery from an inline keyboard.
                User user = message == null ? u.callbackQuery().from() : message.from();
                if (message == null){          //In this case, we get the message form the callbackQuery, which is granted not to be null.
                    message = u.callbackQuery().message();
                }
                Chat chat = message.chat();

                if (u.callbackQuery() != null && u.callbackQuery().data().equals("/reset_yes")){
                    new ServerRequestsDispatcher().deleteUserData(user.id());
                    sendMessage = new SendMessage(chat.id(), "All data cleared. Start again with /start");
                    bot.execute(sendMessage);
                    
                } else if (u.callbackQuery() != null && u.callbackQuery().data().equals("/reset_cancel")){
                    sendMessage = new SendMessage(chat.id(), "Aborted.");
                    bot.execute(sendMessage);
                } else if (message.text().equalsIgnoreCase("/start")) {
                    switch (new ServerRequestsDispatcher().checkUserData(user.id())) {
                        case "0":
                            sendMessage = new SendMessage(chat.id(), "No records found.\nInsert your current odometer: ");
                            awaitsForData = true;
                            bot.execute(sendMessage);
                            break;
                        case "1":
                            sendMessage = new SendMessage(chat.id(), "Previous records detected! Use /help for more info");
                            bot.execute(sendMessage);
                    }
                } else if (message.text().equalsIgnoreCase("/global")) {
                    double mileage = new ServerRequestsDispatcher().globalMileage(user.id());
                    sendMessage = new SendMessage(chat.id(), "Your global mileage is:\n" + (Math.round(mileage * 100.0)/ 100.0) + " l/100 km");
                    bot.execute(sendMessage);
                }else if (message.text().equalsIgnoreCase("/restart")){
                    sendMessage = new SendMessage(chat.id(), "You are about to reset your stats. This can't be undone."
                            + "Continue?");
                    InlineKeyboardMarkup kb = new InlineKeyboardMarkup( new InlineKeyboardButton[] {
                        new InlineKeyboardButton("Yes").callbackData("/reset_yes"),
                        new InlineKeyboardButton("No").callbackData("/reset_cancel")
                    });
                    sendMessage.replyMarkup(kb);
                    bot.execute(sendMessage);
                    
                }else if (message.text().equalsIgnoreCase("/help")){
                    String msg = "You can add a new refuel using the command\n"
                            + "/new_refuel odometer litres euros [full]\n"
                            + "The three parameters are required and must be writed in that order.\n\n"
                            + "Example:\n"
                            + "/new_refuel 34223 40 45\n\n"
                            + "Additionally you can specify if it was a full refuel providing a fourth parameter\n\n"
                            + "/new_refuel 35001 38 43 full"
                            + "You can also use the \"/\" button next to the input field to see other avalaible commands.";
                    sendMessage = new SendMessage(chat.id(), msg);
                    bot.execute(sendMessage);
                    
                } else if (message.text().split(" ")[0].equalsIgnoreCase("/new_refuel")) {
                    String[] split = message.text().split(" ");
                    if (split.length > 4){
                        if (new ServerRequestsDispatcher().newRefuel(user.id(), split[1], split[2], split[3], split[4])) {
                            sendMessage = new SendMessage(chat.id(), "New refuel added successfully!");
                            bot.execute(sendMessage);
                        }
                    }
                    else if (split.length > 3) {
                        if (new ServerRequestsDispatcher().newRefuel(user.id(), split[1], split[2], split[3], null)) {
                            sendMessage = new SendMessage(chat.id(), "New refuel added successfully!");
                            bot.execute(sendMessage);
                        }
                    }
                    else {
                        sendMessage = new SendMessage(chat.id(), "You must provide the required parameters");
                        bot.execute(sendMessage);
                    }
                } else if (awaitsForData) {
                    try {
                        Integer.parseInt(message.text());
                        new ServerRequestsDispatcher().setCurrentOdometer(user.id(), message.text(), chat.id(), user.firstName());
                        awaitsForData = false;
                        sendMessage = new SendMessage(chat.id(), "You are all up to begin.\nUse /help to show the command list.");
                        bot.execute(sendMessage);
                    } catch (NumberFormatException e){
                        sendMessage = new SendMessage(chat.id(), "You must insert an integer number. Try again:");
                        bot.execute(sendMessage);
                    }
                } else {
                    sendMessage = new SendMessage(chat.id(), "You are ready to go.\nUse /help to show the command list.");
                    bot.execute(sendMessage);
                }
            }
        }
    }
}
