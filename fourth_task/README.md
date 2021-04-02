# Provision ec2 server with the requirements to compile NodeJS using Ansible

## My considerations:  

I made 2 versions, one just with the requerimients (simple) and the other one cloning the repo and buidling it (full)


## Requeriments

- [python3](https://www.python.org/downloads/)
- [Ansible](https://ansible.com/)
- AWS account
- AWS Cli configured
- the `.pem` AWS connection file should be in the root of this folder

## How to run it

- Run `cp  info-example.yml info.yml` and edit the aws_id, aws_key and ssh_keyname (please check the others) 
- Run `ansible-playbook  playbook.yaml`

