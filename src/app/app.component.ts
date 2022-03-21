import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from 'src/employee';
import { EmployeeService } from 'src/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeesService: EmployeeService) { }

  ngOnInit(){
    this.getEmployee();
  }

  public getEmployee(): void{
    this.employeesService.getEmployees().subscribe(
        (response: Employee[]) => {
          this.employees = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
    );
  }

  public searchEmployees(key:string):void{
    const results:Employee[] = [];
    for(const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase())!== -1
      ||employee.email.toLowerCase().indexOf(key.toLowerCase())!== -1
      ||employee.phoneNumber.toLowerCase().indexOf(key.toLowerCase())!== -1
      ||employee.jobTitle.toLowerCase().indexOf(key.toLowerCase())!== -1)
        results.push(employee);
    }
    this.employees = results;
    if(results.length === 0 || !key)
      this.getEmployee();
  }

  public onAddEmployee(form:NgForm): void{
    document.getElementById("add-employee-form").click();
    this.employeesService.addEmployee(form.value).subscribe(
      (response:Employee) => {
         console.log(response);
         this.getEmployee();
         form.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUpdateEmployee(employee:Employee): void{
    document.getElementById("update-employee-form").click();
    this.employeesService.updateEmployee(employee).subscribe(
      (response:Employee) => {
         console.log(response);
         this.getEmployee();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId:number): void{
    document.getElementById("delete-employee-form").click();
    this.employeesService.deleteEmployee(employeeId).subscribe(
      (response:void) => {
        this.getEmployee();
     },
     (error: HttpErrorResponse) => {
       alert(error.message);
     }
    );
  }

  public onOpenModel(employee: Employee, mode: String): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none'; 
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if(mode === 'edit'){
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode === 'delete'){
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  

}
