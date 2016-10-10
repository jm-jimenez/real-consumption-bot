/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.ddns.dam2chema.java.bot.logic;

import java.util.Scanner;

/**
 *
 * @author jmjimenez
 */
public class BotServicesController implements Runnable {
    
    private boolean stop;
    
    public BotServicesController (){
        
        stop = false;
    }

    @Override
    public void run() {
        Scanner lector = new Scanner(System.in);
        lector.nextLine();
        stop = true;
    }
    
    public boolean botStop(){
        return stop;
    }
}
