drop table towns, number_plates cascade;

create table towns
(
    id serial not null primary key,
    towns_names text not null
   
);

create table number_plates
(
    id serial not null primary key,
    plates text not null,
    towns_id int not null,
    foreign key (towns_id) references towns(id)
);

insert into towns (towns_names) values ('CA');
insert into towns (towns_names) values ('CY');
insert into towns (towns_names) values ('CL');
insert into towns (towns_names) values ('CAW');
insert into towns (towns_names) values ('CJ');