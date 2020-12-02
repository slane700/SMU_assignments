#Query1 
select 
    e.emp_no,
    e.first_name,
    e.last_name,
    e.sex,
    s.salary
from 
    employees_demo e
join salaries s on e.emp_no = s.emp_no


#Query2
select 
	first_name,
	last_name,
	hire_date
from 
	employees_demo 
where
	extract(year from hire_date) = 1986
order by
	hire_date asc

#Query3
select 
    d.dept_no, 
    de.dept_name,
    d.emp_no, 
    e.last_name,
    e.first_name
from 
    dept_manager d
join employees_demo e on d.emp_no = e.emp_no
join dept de on d.dept_no = de.dept_no


#Query4 
select 
    e.emp_no, 
    e.last_name, 
    e.first_name, 
    d.dept_name
from 
    employees_demo e
join dept_emp de on e.emp_no = de.emp_no
join dept d on de.dept_no = d.dept_no

#Query5 
select 
    first_name,
    last_name,
    sex
from 
    employees_demo 
where 
    (first_name = 'Hercules')
    and (last_name like 'B%')

#Query6
select 
    e.emp_no, 
    e.last_name, 
    e.first_name, 
    d.dept_name
from 
    employees_demo e
join dept_emp de on e.emp_no = de.emp_no
join dept d on de.dept_no = d.dept_no
where
    d.dept_name = 'Sales'

#Query7 
select 
    e.emp_no, 
    e.last_name, 
    e.first_name, 
    d.dept_name
from 
    employees_demo e
join dept_emp de on e.emp_no = de.emp_no
join dept d on de.dept_no = d.dept_no
where
    d.dept_name = 'Sales' or 
    d.dept_name = 'Development'

#Query8 
select 
	count(*),
	last_name
from 
    employees_demo 
group by 
    last_name
order by 
    count DESC


