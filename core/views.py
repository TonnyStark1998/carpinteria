from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout


def home(request):
    return render(request, 'core/home.html')


@login_required
def calculadora(request):
    return render(request, 'core/calculadora.html')


@login_required
def paint(request):
    return render(request, 'core/paint.html')


@login_required
def start_view(request):
    return render(request, 'core/start_view.html')


def exit_session(request):
    logout(request)
    return redirect('home')
