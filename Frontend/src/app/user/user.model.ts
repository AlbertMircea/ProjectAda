import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class  User {

    UserId!: number;
    FirstName!: string;
    LastName!: string;
    Email!: string;
    Gender!: string;
    Active!: boolean;
    JobTitle!: string;
    Department!: string;
    Salary!: number;
    AvgSalary!: number;
    Token!:string;
    Role!:string;

  constructor()
  {
    const tasks = localStorage.getItem('authToken');
    if(tasks)
    {
        this.Token = JSON.parse(tasks);
    }
  }
  

  }
